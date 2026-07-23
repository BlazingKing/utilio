"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { TextArea, Input, Chip, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Mode = "encrypt" | "decrypt";
type Kdf = "evp-md5" | "pbkdf2";

const KDF_LABEL: Record<Kdf, string> = {
  "evp-md5": "CryptoJS / OpenSSL (MD5)",
  pbkdf2: "OpenSSL -pbkdf2 (SHA-256)",
};

/** MD5 สำหรับ EVP_BytesToKey (key derivation แบบ OpenSSL/CryptoJS) — Web Crypto ไม่มี MD5 */
function md5(bytes: Uint8Array): Uint8Array {
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);

  const msgLen = bytes.length;
  const paddedLen = (((msgLen + 8) >> 6) + 1) << 6;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[msgLen] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(paddedLen - 8, (msgLen * 8) >>> 0, true);
  dv.setUint32(paddedLen - 4, Math.floor((msgLen * 8) / 4294967296), true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let off = 0; off < paddedLen; off += 64) {
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + dv.getUint32(off + g * 4, true)) >>> 0;
      A = D; D = C; C = B;
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }

  const out = new Uint8Array(16);
  const odv = new DataView(out.buffer);
  odv.setUint32(0, a0, true);
  odv.setUint32(4, b0, true);
  odv.setUint32(8, c0, true);
  odv.setUint32(12, d0, true);
  return out;
}

/** EVP_BytesToKey (MD5) — สร้าง key 32 byte + IV 16 byte จากรหัสผ่านและ salt */
function evpKdf(password: Uint8Array, salt: Uint8Array): { key: Uint8Array; iv: Uint8Array } {
  let derived: Uint8Array = new Uint8Array(0);
  let block: Uint8Array = new Uint8Array(0);
  while (derived.length < 48) {
    const data = new Uint8Array(block.length + password.length + salt.length);
    data.set(block);
    data.set(password, block.length);
    data.set(salt, block.length + password.length);
    block = md5(data);
    const next = new Uint8Array(derived.length + 16);
    next.set(derived);
    next.set(block, derived.length);
    derived = next;
  }
  return { key: derived.slice(0, 32), iv: derived.slice(32, 48) };
}

/** PBKDF2-SHA256 10,000 รอบ (ค่า default ของ `openssl enc -pbkdf2`) */
async function pbkdf2Kdf(password: Uint8Array, salt: Uint8Array): Promise<{ key: Uint8Array; iv: Uint8Array }> {
  const base = await crypto.subtle.importKey("raw", password as BufferSource, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: 10000 },
    base,
    48 * 8,
  );
  const derived = new Uint8Array(bits);
  return { key: derived.slice(0, 32), iv: derived.slice(32, 48) };
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64.replace(/\s/g, ""));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function aesCbc(
  op: "encrypt" | "decrypt",
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key as BufferSource, "AES-CBC", false, [op]);
  const params = { name: "AES-CBC", iv: iv as BufferSource };
  const result =
    op === "encrypt"
      ? await crypto.subtle.encrypt(params, cryptoKey, data as BufferSource)
      : await crypto.subtle.decrypt(params, cryptoKey, data as BufferSource);
  return new Uint8Array(result);
}

/** เข้ารหัสแบบ CryptoJS.AES.encrypt(msg, pass).toString() — "Salted__" + salt + ciphertext */
async function encryptText(text: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(8));
  const { key, iv } = evpKdf(new TextEncoder().encode(password), salt);
  const cipher = await aesCbc("encrypt", key, iv, new TextEncoder().encode(text));
  const out = new Uint8Array(16 + cipher.length);
  out.set(new TextEncoder().encode("Salted__"));
  out.set(salt, 8);
  out.set(cipher, 16);
  return toBase64(out);
}

async function decryptText(b64: string, password: string): Promise<{ text: string; kdf: Kdf }> {
  const raw = fromBase64(b64);
  const header = new TextDecoder().decode(raw.slice(0, 8));
  if (header !== "Salted__" || raw.length < 17) {
    throw new Error("ไม่ใช่รูปแบบ OpenSSL/CryptoJS (ต้องขึ้นต้นด้วย Salted__ หลังถอด Base64)");
  }
  const salt = raw.slice(8, 16);
  const cipher = raw.slice(16);
  const pass = new TextEncoder().encode(password);

  // ลอง key derivation ทั้งสองแบบ — CryptoJS ใช้ MD5, openssl รุ่นใหม่ใช้ -pbkdf2
  for (const kdf of ["evp-md5", "pbkdf2"] as Kdf[]) {
    try {
      const { key, iv } = kdf === "evp-md5" ? evpKdf(pass, salt) : await pbkdf2Kdf(pass, salt);
      const plain = await aesCbc("decrypt", key, iv, cipher);
      return { text: new TextDecoder("utf-8", { fatal: true }).decode(plain), kdf };
    } catch {
      // padding หรือ UTF-8 ไม่ผ่าน = รหัสผิดหรือคนละ KDF — ลองแบบถัดไป
    }
  }
  throw new Error("ถอดรหัสไม่สำเร็จ — รหัสผ่านไม่ถูกต้อง");
}

export function AesTool() {
  const [mode, setMode] = useState<Mode>("decrypt");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usedKdf, setUsedKdf] = useState<Kdf | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async (): Promise<{ output: string; error: string | null; kdf: Kdf | null }> => {
      if (!input || !password) return { output: "", error: null, kdf: null };
      try {
        if (mode === "encrypt") {
          return { output: await encryptText(input, password), error: null, kdf: "evp-md5" };
        }
        const { text, kdf } = await decryptText(input, password);
        return { output: text, error: null, kdf };
      } catch (e) {
        return { output: "", error: e instanceof Error ? e.message : "เกิดข้อผิดพลาด", kdf: null };
      }
    };
    run().then((r) => {
      if (cancelled) return;
      setOutput(r.output);
      setError(r.error);
      setUsedKdf(r.kdf);
    });
    return () => {
      cancelled = true;
    };
  }, [input, password, mode]);

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        className="self-start"
        aria-label="โหมด AES"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "encrypt", label: "เข้ารหัส" },
          { value: "decrypt", label: "ถอดรหัส" },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="aes-pass" className="text-sm font-medium">
          รหัสผ่าน (Passphrase)
        </Label>
        <Input
          id="aes-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่านที่ใช้เข้ารหัส/ถอดรหัส..."
          fullWidth
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="aes-in" className="text-sm font-medium">
          {mode === "encrypt" ? "ข้อความ" : "ข้อมูลเข้ารหัส (Base64)"}
        </Label>
        <TextArea
          id="aes-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encrypt" ? "พิมพ์ข้อความที่ต้องการเข้ารหัส..." : "วาง Base64 ที่ขึ้นต้นด้วย U2FsdGVkX1..."}
          rows={5}
          fullWidth
          className="resize-y font-mono"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-center text-muted">
        <ArrowRightLeft className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="aes-out" className="text-sm font-medium">
              {mode === "encrypt" ? "ข้อมูลเข้ารหัส (Base64)" : "ข้อความ"}
            </Label>
            {usedKdf && output && (
              <Chip size="sm" variant="secondary">{KDF_LABEL[usedKdf]}</Chip>
            )}
          </div>
          <CopyButton value={output} />
        </div>
        <TextArea
          id="aes-out"
          value={error ?? output}
          readOnly
          rows={5}
          fullWidth
          className={`resize-y font-mono ${error ? "text-red-600 dark:text-red-400" : ""}`}
          spellCheck={false}
        />
      </div>

      <p className="text-xs text-muted">
        AES-256-CBC ในรูปแบบ OpenSSL salted (เข้ากันได้กับ <code>CryptoJS.AES.encrypt</code> และ{" "}
        <code>openssl enc -aes-256-cbc</code>) — ตอนถอดรหัสจะลอง key derivation ทั้งแบบ MD5 และ PBKDF2 ให้อัตโนมัติ
        ทุกอย่างประมวลผลในเบราว์เซอร์
      </p>
    </div>
  );
}

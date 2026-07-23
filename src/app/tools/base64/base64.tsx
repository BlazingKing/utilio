"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, ShieldCheck } from "lucide-react";
import { TextArea, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Mode = "encode" | "decode";

/** เข้ารหัส Base64 แบบรองรับ Unicode (ภาษาไทย/อีโมจิ) */
function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decodeBase64(b64: string): string {
  const binary = atob(b64.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      return {
        output: mode === "encode" ? encodeBase64(input) : decodeBase64(input),
        error: null as string | null,
      };
    } catch {
      return { output: "", error: "ข้อมูลไม่ใช่ Base64 ที่ถูกต้อง" };
    }
  }, [input, mode]);

  // "U2FsdGVkX1" = base64 ของ "Salted__" — ข้อมูลเข้ารหัส AES แบบ OpenSSL/CryptoJS ไม่ใช่ข้อความธรรมดา
  const isEncrypted = mode === "decode" && input.trim().startsWith("U2FsdGVkX1");

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        className="self-start"
        aria-label="โหมด Base64"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "encode", label: "เข้ารหัส" },
          { value: "decode", label: "ถอดรหัส" },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="b64-in" className="text-sm font-medium">
          {mode === "encode" ? "ข้อความ" : "Base64"}
        </Label>
        <TextArea
          id="b64-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "พิมพ์ข้อความ..." : "วาง Base64..."}
          rows={5}
          fullWidth
          className="resize-y font-mono"
          spellCheck={false}
        />
      </div>

      {isEncrypted && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            ข้อมูลนี้ถูกเข้ารหัสด้วย AES แบบ OpenSSL/CryptoJS (ขึ้นต้นด้วย{" "}
            <code className="font-mono">Salted__</code>) ไม่ใช่ Base64 ธรรมดา — ต้องใช้รหัสผ่านถอด ไปที่{" "}
            <Link href="/tools/aes" className="font-medium underline underline-offset-2">
              เครื่องมือ AES เข้ารหัส / ถอดรหัส
            </Link>
          </p>
        </div>
      )}

      <div className="flex items-center justify-center text-muted">
        <ArrowRightLeft className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="b64-out" className="text-sm font-medium">
            {mode === "encode" ? "Base64" : "ข้อความ"}
          </Label>
          <CopyButton value={output} />
        </div>
        <TextArea
          id="b64-out"
          value={error ?? output}
          readOnly
          rows={5}
          fullWidth
          className={`resize-y font-mono ${error ? "text-red-600 dark:text-red-400" : ""}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

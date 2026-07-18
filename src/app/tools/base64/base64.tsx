"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

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

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-xl border border-border bg-surface-2 p-1 text-sm">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-1.5 font-medium transition-colors ${
              mode === m ? "bg-brand text-white" : "text-muted hover:text-foreground"
            }`}
          >
            {m === "encode" ? "เข้ารหัส" : "ถอดรหัส"}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="b64-in" className="mb-1.5 block text-sm font-medium">
          {mode === "encode" ? "ข้อความ" : "Base64"}
        </label>
        <textarea
          id="b64-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "พิมพ์ข้อความ..." : "วาง Base64..."}
          rows={5}
          className="field-mono resize-y"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-center text-muted">
        <ArrowRightLeft className="h-4 w-4" />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="b64-out" className="text-sm font-medium">
            {mode === "encode" ? "Base64" : "ข้อความ"}
          </label>
          <CopyButton value={output} className="btn-ghost !px-2.5 !py-1 text-xs" />
        </div>
        <textarea
          id="b64-out"
          value={error ?? output}
          readOnly
          rows={5}
          className={`field-mono resize-y bg-surface-2 ${error ? "text-red-600 dark:text-red-400" : ""}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

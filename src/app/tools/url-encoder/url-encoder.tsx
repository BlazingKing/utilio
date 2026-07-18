"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type Mode = "encode" | "decode";

export function UrlEncoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      return {
        output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
        error: null as string | null,
      };
    } catch {
      return { output: "", error: "ข้อมูลไม่สามารถถอดรหัสได้ (URI ไม่ถูกต้อง)" };
    }
  }, [input, mode]);

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-xl border border-border bg-surface-2 p-1 text-sm">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-1.5 font-medium transition-colors ${mode === m ? "bg-brand text-white" : "text-muted hover:text-foreground"}`}
          >
            {m === "encode" ? "เข้ารหัส" : "ถอดรหัส"}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          {mode === "encode" ? "ข้อความ / URL" : "URL ที่เข้ารหัสแล้ว"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "https://example.com/?q=สวัสดี" : "https%3A%2F%2Fexample.com"}
          rows={4}
          className="field-mono resize-y"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-center text-muted">
        <ArrowRightLeft className="h-4 w-4" />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium">ผลลัพธ์</span>
          <CopyButton value={output} className="btn-ghost !px-2.5 !py-1 text-xs" />
        </div>
        <textarea
          value={error ?? output}
          readOnly
          rows={4}
          className={`field-mono resize-y bg-surface-2 ${error ? "text-red-600 dark:text-red-400" : ""}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

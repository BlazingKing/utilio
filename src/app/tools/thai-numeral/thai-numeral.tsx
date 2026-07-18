"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

const THAI = "๐๑๒๓๔๕๖๗๘๙";
const ARABIC = "0123456789";

function toThai(s: string): string {
  return s.replace(/[0-9]/g, (d) => THAI[ARABIC.indexOf(d)]);
}
function toArabic(s: string): string {
  return s.replace(/[๐-๙]/g, (d) => ARABIC[THAI.indexOf(d)]);
}

type Mode = "toThai" | "toArabic";

export function ThaiNumeral() {
  const [mode, setMode] = useState<Mode>("toThai");
  const [input, setInput] = useState("");

  const output = useMemo(
    () => (mode === "toThai" ? toThai(input) : toArabic(input)),
    [input, mode],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start rounded-xl border border-border bg-surface-2 p-1 text-sm">
        <button
          onClick={() => setMode("toThai")}
          className={`rounded-lg px-4 py-1.5 font-medium transition-colors ${mode === "toThai" ? "bg-brand text-white" : "text-muted hover:text-foreground"}`}
        >
          อารบิก → ไทย
        </button>
        <button
          onClick={() => setMode("toArabic")}
          className={`rounded-lg px-4 py-1.5 font-medium transition-colors ${mode === "toArabic" ? "bg-brand text-white" : "text-muted hover:text-foreground"}`}
        >
          ไทย → อารบิก
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "toThai" ? "พิมพ์ข้อความที่มีเลข 0-9..." : "พิมพ์ข้อความที่มีเลข ๐-๙..."}
        rows={4}
        className="field resize-y text-lg"
      />

      <div className="flex items-center justify-center text-muted">
        <ArrowRightLeft className="h-4 w-4" />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium">ผลลัพธ์</span>
          <CopyButton value={output} className="btn-ghost !px-2.5 !py-1 text-xs" />
        </div>
        <div className="field min-h-24 whitespace-pre-wrap break-words bg-surface-2 text-lg">
          {output || <span className="text-muted">—</span>}
        </div>
      </div>
    </div>
  );
}

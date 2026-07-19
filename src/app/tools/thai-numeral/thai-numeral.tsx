"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { TextArea } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

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
      <SegmentedControl
        className="self-start"
        aria-label="ทิศทางการแปลง"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "toThai", label: "อารบิก → ไทย" },
          { value: "toArabic", label: "ไทย → อารบิก" },
        ]}
      />

      <TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "toThai" ? "พิมพ์ข้อความที่มีเลข 0-9..." : "พิมพ์ข้อความที่มีเลข ๐-๙..."}
        rows={4}
        fullWidth
        className="resize-y text-lg"
        aria-label="ข้อความต้นฉบับ"
      />

      <div className="flex items-center justify-center text-muted">
        <ArrowRightLeft className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">ผลลัพธ์</span>
          <CopyButton value={output} />
        </div>
        <div className="min-h-24 whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-2 px-3 py-2 text-lg">
          {output || <span className="text-muted">—</span>}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { TextArea, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

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
      <SegmentedControl
        className="self-start"
        aria-label="โหมด URL"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "encode", label: "เข้ารหัส" },
          { value: "decode", label: "ถอดรหัส" },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">
          {mode === "encode" ? "ข้อความ / URL" : "URL ที่เข้ารหัสแล้ว"}
        </Label>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "https://example.com/?q=สวัสดี" : "https%3A%2F%2Fexample.com"}
          rows={4}
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
          <span className="text-sm font-medium">ผลลัพธ์</span>
          <CopyButton value={output} />
        </div>
        <TextArea
          value={error ?? output}
          readOnly
          rows={4}
          fullWidth
          className={`resize-y font-mono ${error ? "text-red-600 dark:text-red-400" : ""}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

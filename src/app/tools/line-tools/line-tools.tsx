"use client";

import { useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, CopyMinus, Scissors, Rows3, FlipVertical2 } from "lucide-react";
import { TextArea, Button, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";

type Op = (lines: string[]) => string[];

const OPS: { label: string; icon: React.ReactNode; fn: Op }[] = [
  { label: "เรียง ก→ฮ / A→Z", icon: <ArrowDownAZ className="h-4 w-4" />, fn: (l) => [...l].sort((a, b) => a.localeCompare(b, "th")) },
  { label: "เรียง ฮ→ก / Z→A", icon: <ArrowUpAZ className="h-4 w-4" />, fn: (l) => [...l].sort((a, b) => b.localeCompare(a, "th")) },
  { label: "ลบบรรทัดซ้ำ", icon: <CopyMinus className="h-4 w-4" />, fn: (l) => [...new Set(l)] },
  { label: "ตัดช่องว่างหัว-ท้าย", icon: <Scissors className="h-4 w-4" />, fn: (l) => l.map((s) => s.trim()) },
  { label: "ลบบรรทัดว่าง", icon: <Rows3 className="h-4 w-4" />, fn: (l) => l.filter((s) => s.trim() !== "") },
  { label: "กลับลำดับ", icon: <FlipVertical2 className="h-4 w-4" />, fn: (l) => [...l].reverse() },
];

export function LineTools() {
  const [text, setText] = useState("");

  function apply(fn: Op) {
    setText(fn(text.split("\n")).join("\n"));
  }

  const lineCount = text ? text.split("\n").length : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {OPS.map((op) => (
          <Button key={op.label} variant="secondary" size="sm" onPress={() => apply(op.fn)} isDisabled={!text}>
            {op.icon} {op.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="lt-text" className="text-sm font-medium">
            ข้อความ ({lineCount} บรรทัด)
          </Label>
          <CopyButton value={text} />
        </div>
        <TextArea
          id="lt-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"วางข้อความหลายบรรทัด...\nแล้วกดปุ่มด้านบนเพื่อจัดการ"}
          rows={12}
          fullWidth
          className="resize-y font-mono"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

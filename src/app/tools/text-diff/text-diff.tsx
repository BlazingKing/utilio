"use client";

import { useMemo, useState } from "react";
import { TextArea, Label } from "@heroui/react";

type Line = { type: "same" | "add" | "del"; text: string };

/** diff ระดับบรรทัดด้วย LCS */
function diffLines(a: string[], b: string[]): Line[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: Line[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "del", text: a[i] });
      i++;
    } else {
      out.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < n) out.push({ type: "del", text: a[i++] });
  while (j < m) out.push({ type: "add", text: b[j++] });
  return out;
}

export function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const { lines, added, removed } = useMemo(() => {
    if (!left && !right) return { lines: [] as Line[], added: 0, removed: 0 };
    const result = diffLines(left.split("\n"), right.split("\n"));
    return {
      lines: result,
      added: result.filter((l) => l.type === "add").length,
      removed: result.filter((l) => l.type === "del").length,
    };
  }, [left, right]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="td-left" className="text-sm font-medium">
            ข้อความต้นฉบับ
          </Label>
          <TextArea
            id="td-left"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="วางข้อความชุดที่ 1..."
            rows={8}
            fullWidth
            className="resize-y font-mono"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="td-right" className="text-sm font-medium">
            ข้อความใหม่
          </Label>
          <TextArea
            id="td-right"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="วางข้อความชุดที่ 2..."
            rows={8}
            fullWidth
            className="resize-y font-mono"
            spellCheck={false}
          />
        </div>
      </div>

      {lines.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">ผลเปรียบเทียบ</span>
            <span className="text-green-600 dark:text-green-400">+{added} เพิ่ม</span>
            <span className="text-red-600 dark:text-red-400">−{removed} ลบ</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface-2 font-mono text-sm">
            {lines.map((l, idx) => (
              <div
                key={idx}
                className={
                  l.type === "add"
                    ? "whitespace-pre-wrap bg-green-500/10 px-3 py-0.5 text-green-700 dark:text-green-300"
                    : l.type === "del"
                      ? "whitespace-pre-wrap bg-red-500/10 px-3 py-0.5 text-red-700 dark:text-red-300"
                      : "whitespace-pre-wrap px-3 py-0.5 text-muted"
                }
              >
                <span className="mr-2 select-none opacity-60">
                  {l.type === "add" ? "+" : l.type === "del" ? "−" : " "}
                </span>
                {l.text || " "}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

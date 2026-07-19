"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { AppSelect } from "@/components/ui/select";

const BASES = [
  { value: "2", label: "ฐาน 2 (binary)" },
  { value: "8", label: "ฐาน 8 (octal)" },
  { value: "10", label: "ฐาน 10 (decimal)" },
  { value: "16", label: "ฐาน 16 (hex)" },
];

const PREFIX: Record<string, string> = { "2": "0b", "8": "0o", "16": "0x", "10": "" };
const VALID: Record<string, RegExp> = {
  "2": /^[01]+$/,
  "8": /^[0-7]+$/,
  "10": /^\d+$/,
  "16": /^[0-9a-fA-F]+$/,
};

export function NumberBase() {
  const [base, setBase] = useState("10");
  const [value, setValue] = useState("255");

  const { error, results } = useMemo(() => {
    const clean = value.trim().replace(/^0[bxo]/i, "");
    if (!clean) return { error: null as string | null, results: null };
    if (!VALID[base].test(clean)) {
      return { error: `ตัวเลขไม่ถูกต้องสำหรับฐาน ${base}`, results: null };
    }
    try {
      const n = BigInt(PREFIX[base] + clean);
      return {
        error: null,
        results: [
          { label: "ฐาน 2 (binary)", value: n.toString(2) },
          { label: "ฐาน 8 (octal)", value: n.toString(8) },
          { label: "ฐาน 10 (decimal)", value: n.toString(10) },
          { label: "ฐาน 16 (hex)", value: n.toString(16).toUpperCase() },
        ],
      };
    } catch {
      return { error: "แปลงไม่สำเร็จ", results: null };
    }
  }, [base, value]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">ฐานของตัวเลข</Label>
          <AppSelect
            aria-label="ฐานตัวเลข"
            className="w-44"
            value={base}
            onChange={setBase}
            options={BASES}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nb-in" className="text-sm font-medium">
            ตัวเลข
          </Label>
          <Input
            id="nb-in"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="เช่น 255 หรือ FF"
            fullWidth
            className="font-mono text-lg"
            spellCheck={false}
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : results ? (
        <div className="flex flex-col gap-2">
          {results.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-32 shrink-0 text-xs font-semibold text-muted">{r.label}</span>
                <code className="truncate font-mono text-sm">{r.value}</code>
              </div>
              <CopyButton value={r.value} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

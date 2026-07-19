"use client";

import { useMemo, useState } from "react";
import { TextArea, Card, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";

/** แยกข้อความเป็นคำ รองรับ camelCase, snake_case, ช่องว่าง, ขีด */
function toWords(input: string): string[] {
  return (
    input
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_\-]+/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const transforms: { label: string; fn: (s: string) => string }[] = [
  { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { label: "lowercase", fn: (s) => s.toLowerCase() },
  {
    label: "Title Case",
    fn: (s) => toWords(s).map(cap).join(" "),
  },
  {
    label: "Sentence case",
    fn: (s) =>
      s
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  {
    label: "camelCase",
    fn: (s) =>
      toWords(s)
        .map((w, i) => (i === 0 ? w.toLowerCase() : cap(w)))
        .join(""),
  },
  {
    label: "PascalCase",
    fn: (s) => toWords(s).map(cap).join(""),
  },
  {
    label: "snake_case",
    fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("_"),
  },
  {
    label: "kebab-case",
    fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("-"),
  },
  {
    label: "CONSTANT_CASE",
    fn: (s) => toWords(s).map((w) => w.toUpperCase()).join("_"),
  },
  {
    label: "aLtErNaTiNg",
    fn: (s) =>
      [...s]
        .map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase()))
        .join(""),
  },
];

export function CaseConverter() {
  const [text, setText] = useState("");

  const results = useMemo(
    () => transforms.map((t) => ({ label: t.label, value: text ? t.fn(text) : "" })),
    [text],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cc-input" className="text-sm font-medium">
          ข้อความต้นฉบับ
        </Label>
        <TextArea
          id="cc-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์หรือวางข้อความที่นี่..."
          rows={4}
          fullWidth
          className="resize-y"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((r) => (
          <Card key={r.label} className="p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-muted">{r.label}</span>
              <CopyButton value={r.value} />
            </div>
            <p className="min-h-6 break-words font-mono text-sm">
              {r.value || <span className="text-muted">—</span>}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

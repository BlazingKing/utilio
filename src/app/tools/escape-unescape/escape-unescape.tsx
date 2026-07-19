"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { TextArea, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { AppSelect } from "@/components/ui/select";

type Kind = "html" | "unicode" | "backslash";
type Dir = "escape" | "unescape";

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function htmlUnescape(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}
function unicodeEscape(s: string): string {
  return s.replace(/[^\x20-\x7E]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
}
function unicodeUnescape(s: string): string {
  return s.replace(/\\u([0-9a-fA-F]{4})/g, (_m, h) => String.fromCharCode(parseInt(h, 16)));
}
function backslashEscape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/"/g, '\\"');
}
function backslashUnescape(s: string): string {
  return s.replace(/\\(["\\nrt])/g, (_m, c) =>
    c === "n" ? "\n" : c === "r" ? "\r" : c === "t" ? "\t" : c,
  );
}

const TRANSFORM: Record<Kind, Record<Dir, (s: string) => string>> = {
  html: { escape: htmlEscape, unescape: htmlUnescape },
  unicode: { escape: unicodeEscape, unescape: unicodeUnescape },
  backslash: { escape: backslashEscape, unescape: backslashUnescape },
};

export function EscapeUnescape() {
  const [kind, setKind] = useState<Kind>("html");
  const [dir, setDir] = useState<Dir>("escape");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return TRANSFORM[kind][dir](input);
    } catch {
      return "";
    }
  }, [input, kind, dir]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">ประเภท</Label>
          <AppSelect
            aria-label="ประเภท"
            className="w-44"
            value={kind}
            onChange={(v) => setKind(v as Kind)}
            options={[
              { value: "html", label: "HTML entity" },
              { value: "unicode", label: "Unicode (\\uXXXX)" },
              { value: "backslash", label: "Backslash (\\n \\t)" },
            ]}
          />
        </div>
        <SegmentedControl
          aria-label="ทิศทาง"
          value={dir}
          onChange={(v) => setDir(v as Dir)}
          options={[
            { value: "escape", label: "Escape" },
            { value: "unescape", label: "Unescape" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="es-in" className="text-sm font-medium">
          ข้อความ
        </Label>
        <TextArea
          id="es-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์หรือวางข้อความ..."
          rows={5}
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
          <Label htmlFor="es-out" className="text-sm font-medium">
            ผลลัพธ์
          </Label>
          <CopyButton value={output} />
        </div>
        <TextArea
          id="es-out"
          value={output}
          readOnly
          rows={5}
          fullWidth
          className="resize-y font-mono"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

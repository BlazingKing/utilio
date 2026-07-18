"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Wand2, Minimize2 } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

type Indent = "2" | "4" | "tab";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<Indent>("2");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function process(minify: boolean) {
    setOk(false);
    if (!input.trim()) {
      setError("กรุณาใส่ JSON ก่อน");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const space = minify ? undefined : indent === "tab" ? "\t" : Number(indent);
      setOutput(JSON.stringify(parsed, null, space));
      setError(null);
      setOk(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON ไม่ถูกต้อง");
      setOutput("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => process(false)} className="btn-primary">
          <Wand2 className="h-4 w-4" /> จัดรูปแบบ
        </button>
        <button onClick={() => process(true)} className="btn-ghost">
          <Minimize2 className="h-4 w-4" /> ย่อ (Minify)
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted">
          <label htmlFor="indent">ระยะเยื้อง</label>
          <select
            id="indent"
            value={indent}
            onChange={(e) => setIndent(e.target.value as Indent)}
            className="field w-auto py-1.5"
          >
            <option value="2">2 ช่องว่าง</option>
            <option value="4">4 ช่องว่าง</option>
            <option value="tab">Tab</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="json-in" className="mb-1.5 block text-sm font-medium">
          JSON ต้นฉบับ
        </label>
        <textarea
          id="json-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name":"utilio","tools":6}'
          rows={8}
          className="field-mono resize-y"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}

      {ok && (
        <div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> JSON ถูกต้อง
        </div>
      )}

      {output && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="json-out" className="text-sm font-medium">
              ผลลัพธ์
            </label>
            <CopyButton value={output} className="btn-ghost !px-2.5 !py-1 text-xs" />
          </div>
          <textarea
            id="json-out"
            value={output}
            readOnly
            rows={10}
            className="field-mono resize-y bg-surface-2"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}

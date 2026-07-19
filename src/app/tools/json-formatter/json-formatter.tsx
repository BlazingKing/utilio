"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Wand2, Minimize2 } from "lucide-react";
import { Button, TextArea, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { AppSelect } from "@/components/ui/select";

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
        <Button variant="primary" onPress={() => process(false)}>
          <Wand2 className="h-4 w-4" /> จัดรูปแบบ
        </Button>
        <Button variant="secondary" onPress={() => process(true)}>
          <Minimize2 className="h-4 w-4" /> ย่อ (Minify)
        </Button>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted">
          <span>ระยะเยื้อง</span>
          <AppSelect
            className="w-36"
            aria-label="ระยะเยื้อง"
            value={indent}
            onChange={(v) => setIndent(v as Indent)}
            options={[
              { value: "2", label: "2 ช่องว่าง" },
              { value: "4", label: "4 ช่องว่าง" },
              { value: "tab", label: "Tab" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="json-in" className="text-sm font-medium">
          JSON ต้นฉบับ
        </Label>
        <TextArea
          id="json-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name":"utilio","tools":6}'
          rows={8}
          fullWidth
          className="resize-y font-mono"
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
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="json-out" className="text-sm font-medium">
              ผลลัพธ์
            </Label>
            <CopyButton value={output} />
          </div>
          <TextArea
            id="json-out"
            value={output}
            readOnly
            rows={10}
            fullWidth
            className="resize-y font-mono"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}

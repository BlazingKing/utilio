"use client";

import { useMemo, useState } from "react";
import { load, dump } from "js-yaml";
import { ArrowRightLeft } from "lucide-react";
import { TextArea, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Mode = "json2yaml" | "yaml2json";

export function JsonYaml() {
  const [mode, setMode] = useState<Mode>("json2yaml");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      if (mode === "json2yaml") {
        const obj = JSON.parse(input);
        return { output: dump(obj, { indent: 2, lineWidth: -1 }), error: null };
      }
      const obj = load(input);
      return { output: JSON.stringify(obj, null, 2), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "ข้อมูลไม่ถูกต้อง" };
    }
  }, [input, mode]);

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        className="self-start"
        aria-label="ทิศทางการแปลง"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "json2yaml", label: "JSON → YAML" },
          { value: "yaml2json", label: "YAML → JSON" },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="jy-in" className="text-sm font-medium">
          {mode === "json2yaml" ? "JSON" : "YAML"}
        </Label>
        <TextArea
          id="jy-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "json2yaml" ? '{"name":"utilio","tags":["a","b"]}' : "name: utilio\ntags:\n  - a\n  - b"}
          rows={8}
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
          <Label htmlFor="jy-out" className="text-sm font-medium">
            {mode === "json2yaml" ? "YAML" : "JSON"}
          </Label>
          <CopyButton value={output} />
        </div>
        <TextArea
          id="jy-out"
          value={error ?? output}
          readOnly
          rows={8}
          fullWidth
          className={`resize-y font-mono ${error ? "text-red-600 dark:text-red-400" : ""}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { TextArea, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Mode = "csv2json" | "json2csv";

/** แยกบรรทัด CSV รองรับค่าที่อยู่ใน "..." และคอมมา/ขึ้นบรรทัดภายใน */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function csvToJson(text: string): string {
  const rows = parseCsv(text);
  if (rows.length < 1) return "[]";
  const header = rows[0];
  const objects = rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, i) => (obj[h] = r[i] ?? ""));
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}

function escapeCsv(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function jsonToCsv(text: string): string {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";
  const headers = Array.from(
    arr.reduce((set: Set<string>, obj) => {
      Object.keys(obj ?? {}).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );
  const lines = [headers.map(escapeCsv).join(",")];
  for (const obj of arr) {
    lines.push(headers.map((h) => escapeCsv((obj ?? {})[h])).join(","));
  }
  return lines.join("\n");
}

export function CsvJson() {
  const [mode, setMode] = useState<Mode>("csv2json");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return {
        output: mode === "csv2json" ? csvToJson(input) : jsonToCsv(input),
        error: null as string | null,
      };
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
          { value: "csv2json", label: "CSV → JSON" },
          { value: "json2csv", label: "JSON → CSV" },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cj-in" className="text-sm font-medium">
          {mode === "csv2json" ? "CSV (บรรทัดแรกเป็นหัวคอลัมน์)" : "JSON (array ของ object)"}
        </Label>
        <TextArea
          id="cj-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "csv2json" ? "name,age\nสมชาย,30\nสมหญิง,25" : '[{"name":"สมชาย","age":30}]'
          }
          rows={7}
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
          <Label htmlFor="cj-out" className="text-sm font-medium">
            {mode === "csv2json" ? "JSON" : "CSV"}
          </Label>
          <CopyButton value={output} />
        </div>
        <TextArea
          id="cj-out"
          value={error ?? output}
          readOnly
          rows={7}
          fullWidth
          className={`resize-y font-mono ${error ? "text-red-600 dark:text-red-400" : ""}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

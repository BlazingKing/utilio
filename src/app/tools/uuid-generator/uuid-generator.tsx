"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

function makeUuids(n: number): string[] {
  return Array.from({ length: Math.min(Math.max(n, 1), 100) }, () => crypto.randomUUID());
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [raw, setRaw] = useState<string[]>(() => makeUuids(5));

  const uuids = uppercase ? raw.map((u) => u.toUpperCase()) : raw;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="uuid-count" className="mb-1.5 block text-sm font-medium">
            จำนวน
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="field w-24"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 py-2 text-sm">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          ตัวพิมพ์ใหญ่
        </label>
        <button onClick={() => setRaw(makeUuids(count))} className="btn-primary ml-auto">
          <RefreshCw className="h-4 w-4" /> สร้างใหม่
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{uuids.length} รายการ (UUID v4)</span>
        <CopyButton
          value={uuids.join("\n")}
          label="คัดลอกทั้งหมด"
          className="btn-ghost !px-2.5 !py-1 text-xs"
        />
      </div>

      <div className="flex flex-col gap-2">
        {uuids.map((u, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2">
            <code className="truncate font-mono text-sm">{u}</code>
            <CopyButton value={u} className="btn-ghost !px-2 !py-1 text-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}

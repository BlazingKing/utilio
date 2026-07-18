"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function TimestampConverter() {
  const [now, setNow] = useState(() => Date.now());

  // นาฬิกาปัจจุบัน
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // timestamp -> date
  const [ts, setTs] = useState("");
  const tsResult = useMemo(() => {
    const raw = ts.trim();
    if (!raw || isNaN(Number(raw))) return null;
    const num = Number(raw);
    // เดา: >= 1e12 ถือเป็นมิลลิวินาที
    const ms = raw.length > 10 || num >= 1e12 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return {
      local: d.toLocaleString("th-TH", { dateStyle: "full", timeStyle: "medium" }),
      iso: d.toISOString(),
      utc: d.toUTCString(),
    };
  }, [ts]);

  // date -> timestamp
  const [dateInput, setDateInput] = useState(() => toLocalInput(new Date()));
  const dateResult = useMemo(() => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    return { sec: Math.floor(d.getTime() / 1000), ms: d.getTime() };
  }, [dateInput]);

  return (
    <div className="flex flex-col gap-6">
      {/* ปัจจุบัน */}
      <div className="card flex flex-wrap items-center justify-between gap-2 p-4">
        <div>
          <p className="text-xs text-muted">Unix timestamp ปัจจุบัน (วินาที)</p>
          <p className="font-mono text-xl font-semibold tabular-nums text-brand">
            {Math.floor(now / 1000)}
          </p>
        </div>
        <CopyButton
          value={String(Math.floor(now / 1000))}
          className="btn-ghost !px-2.5 !py-1 text-xs"
        />
      </div>

      {/* timestamp -> date */}
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted">Timestamp → วันที่</h3>
        <input
          type="text"
          inputMode="numeric"
          value={ts}
          onChange={(e) => setTs(e.target.value)}
          placeholder="เช่น 1752883200 หรือ 1752883200000"
          className="field-mono"
        />
        {tsResult && (
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Row label="เวลาท้องถิ่น" value={tsResult.local} />
            <Row label="ISO 8601" value={tsResult.iso} mono />
            <Row label="UTC" value={tsResult.utc} mono />
          </div>
        )}
      </div>

      {/* date -> timestamp */}
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted">วันที่ → Timestamp</h3>
        <input
          type="datetime-local"
          step={1}
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="field w-auto"
        />
        {dateResult && (
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Row label="วินาที (seconds)" value={String(dateResult.sec)} mono />
            <Row label="มิลลิวินาที (ms)" value={String(dateResult.ms)} mono />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2">
      <div className="min-w-0">
        <span className="mr-2 text-xs text-muted">{label}</span>
        <span className={mono ? "font-mono" : ""}>{value}</span>
      </div>
      <CopyButton value={value} className="btn-ghost !px-2 !py-1 text-xs" />
    </div>
  );
}

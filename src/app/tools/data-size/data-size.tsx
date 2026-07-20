"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { AppSelect } from "@/components/ui/select";

const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
}

function fmt(n: number): string {
  if (n === 0) return "0";
  if (n < 0.0001) return n.toExponential(4);
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function duration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} มิลลิวินาที`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  const parts: string[] = [];
  if (h) parts.push(`${h} ชม.`);
  if (m) parts.push(`${m} นาที`);
  if (s || parts.length === 0) parts.push(`${s} วินาที`);
  return parts.join(" ");
}

export function DataSize() {
  const [base, setBase] = useState("1024");
  const [value, setValue] = useState("1.5");
  const [unit, setUnit] = useState("GB");
  const [speed, setSpeed] = useState("100");

  const B = Number(base);
  const bytes = useMemo(() => num(value) * Math.pow(B, UNITS.indexOf(unit)), [value, unit, B]);

  const rows = UNITS.map((u, i) => ({ unit: u, value: bytes / Math.pow(B, i) }));

  const seconds = useMemo(() => {
    const mbps = num(speed);
    if (mbps <= 0) return 0;
    return (bytes * 8) / (mbps * 1_000_000);
  }, [bytes, speed]);

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="ฐานการคำนวณ"
        value={base}
        onChange={setBase}
        options={[
          { value: "1024", label: "ฐาน 1024 (ไบนารี)" },
          { value: "1000", label: "ฐาน 1000 (SI)" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ds-v" className="text-sm font-medium">
            ขนาด
          </Label>
          <Input id="ds-v" type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} fullWidth className="text-lg" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">หน่วย</Label>
          <AppSelect
            aria-label="หน่วย"
            className="w-28"
            value={unit}
            onChange={setUnit}
            options={UNITS.map((u) => ({ value: u, label: u }))}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.unit} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="w-10 shrink-0 text-xs font-semibold text-muted">{r.unit}</span>
              <code className="truncate font-mono text-sm tabular-nums">{fmt(r.value)}</code>
            </div>
            <CopyButton value={String(r.value)} />
          </div>
        ))}
      </div>

      <Card className="p-4">
        <p className="mb-2 text-sm font-semibold text-muted">เวลาดาวน์โหลดโดยประมาณ</p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ds-speed" className="text-sm font-medium">
              ความเร็วเน็ต (Mbps)
            </Label>
            <Input id="ds-speed" type="text" inputMode="decimal" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-32" />
          </div>
          <p className="pb-2 text-lg font-semibold text-brand">{duration(seconds)}</p>
        </div>
      </Card>

      <p className="text-xs text-muted">
        ฐาน 1024 คือแบบที่ระบบปฏิบัติการใช้ (1 KB = 1,024 B) ส่วนฐาน 1000 คือแบบที่ผู้ผลิตฮาร์ดดิสก์ใช้
      </p>
    </div>
  );
}

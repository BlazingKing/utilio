"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";
import { SegmentedControl } from "@/components/ui/segmented-control";

const SQM_PER = { rai: 1600, ngan: 400, wa: 4, sqft: 0.09290304, acre: 4046.8564224 };

type Mode = "thai" | "metric";

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
}

function fmt(n: number, d = 2): string {
  return n.toLocaleString("th-TH", { maximumFractionDigits: d });
}

export function ThaiLandUnit() {
  const [mode, setMode] = useState<Mode>("thai");
  const [rai, setRai] = useState("1");
  const [ngan, setNgan] = useState("2");
  const [wa, setWa] = useState("50");
  const [sqm, setSqm] = useState("2000");

  const totalSqm = useMemo(() => {
    if (mode === "thai") {
      return num(rai) * SQM_PER.rai + num(ngan) * SQM_PER.ngan + num(wa) * SQM_PER.wa;
    }
    return num(sqm);
  }, [mode, rai, ngan, wa, sqm]);

  const breakdown = useMemo(() => {
    let rem = totalSqm;
    const r = Math.floor(rem / SQM_PER.rai);
    rem -= r * SQM_PER.rai;
    const n = Math.floor(rem / SQM_PER.ngan);
    rem -= n * SQM_PER.ngan;
    const w = rem / SQM_PER.wa;
    return { r, n, w };
  }, [totalSqm]);

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="โหมด"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "thai", label: "จาก ไร่-งาน-วา" },
          { value: "metric", label: "จาก ตร.ม." },
        ]}
      />

      {mode === "thai" ? (
        <div className="grid grid-cols-3 gap-3">
          <Field id="lu-rai" label="ไร่" value={rai} onChange={setRai} />
          <Field id="lu-ngan" label="งาน" value={ngan} onChange={setNgan} />
          <Field id="lu-wa" label="ตารางวา" value={wa} onChange={setWa} />
        </div>
      ) : (
        <Field id="lu-sqm" label="ตารางเมตร (ตร.ม.)" value={sqm} onChange={setSqm} />
      )}

      <Card className="flex flex-col items-center gap-1 bg-brand-soft p-5 text-center text-brand">
        <p className="text-sm">รวมพื้นที่</p>
        <p className="text-2xl font-bold tabular-nums">{fmt(totalSqm)} ตร.ม.</p>
        <p className="text-sm">
          = {breakdown.r} ไร่ {breakdown.n} งาน {fmt(breakdown.w)} ตารางวา
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="ตารางวา" value={fmt(totalSqm / SQM_PER.wa)} />
        <Stat label="ตารางเมตร" value={fmt(totalSqm)} />
        <Stat label="ตารางฟุต" value={fmt(totalSqm / SQM_PER.sqft)} />
        <Stat label="เอเคอร์" value={fmt(totalSqm / SQM_PER.acre, 4)} />
      </div>

      <p className="text-xs text-muted">1 ไร่ = 4 งาน = 400 ตารางวา = 1,600 ตร.ม.</p>
    </div>
  );
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input id={id} type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} fullWidth />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3 text-center">
      <div className="font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";
import { SegmentedControl } from "@/components/ui/segmented-control";

type RateType = "1.1" | "1.2";

/** อัตราค่าพลังงานไฟฟ้าบ้านอยู่อาศัย: [หน่วยสะสมสูงสุดของขั้น, บาท/หน่วย] */
const TIERS: Record<RateType, [number, number][]> = {
  "1.1": [
    [15, 2.3488],
    [25, 2.9882],
    [35, 3.2405],
    [100, 3.6237],
    [150, 3.7171],
    [400, 4.2218],
    [Infinity, 4.4217],
  ],
  "1.2": [
    [150, 3.2484],
    [400, 4.2218],
    [Infinity, 4.4217],
  ],
};

const SERVICE_FEE: Record<RateType, number> = { "1.1": 8.19, "1.2": 24.62 };

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
}
function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ElectricityBill() {
  const [units, setUnits] = useState("350");
  const [type, setType] = useState<RateType>("1.2");
  const [ft, setFt] = useState("0.3972");
  const [vat, setVat] = useState("7");

  const r = useMemo(() => {
    const u = num(units);
    const tiers = TIERS[type];
    let remaining = u;
    let prev = 0;
    let energy = 0;
    const steps: { range: string; rate: number; units: number; amount: number }[] = [];
    for (const [cap, rate] of tiers) {
      if (remaining <= 0) break;
      const width = cap - prev;
      const used = Math.min(remaining, width);
      const amount = used * rate;
      energy += amount;
      steps.push({
        range: `${prev + 1}–${cap === Infinity ? "ขึ้นไป" : cap}`,
        rate,
        units: used,
        amount,
      });
      remaining -= used;
      prev = cap;
    }
    const service = SERVICE_FEE[type];
    const ftAmount = u * num(ft);
    const beforeVat = energy + service + ftAmount;
    const vatAmount = beforeVat * (num(vat) / 100);
    const total = beforeVat + vatAmount;
    return { u, steps, energy, service, ftAmount, beforeVat, vatAmount, total, perUnit: u > 0 ? total / u : 0 };
  }, [units, type, ft, vat]);

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="ประเภทผู้ใช้ไฟ"
        value={type}
        onChange={(v) => setType(v as RateType)}
        options={[
          { value: "1.2", label: "1.2 (ใช้เกิน 150 หน่วย)" },
          { value: "1.1", label: "1.1 (ไม่เกิน 150 หน่วย)" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="eb-u" className="text-sm font-medium">
            หน่วยที่ใช้ (kWh)
          </Label>
          <Input id="eb-u" type="text" inputMode="decimal" value={units} onChange={(e) => setUnits(e.target.value)} fullWidth className="text-lg" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="eb-ft" className="text-sm font-medium">
            ค่า Ft (บาท/หน่วย)
          </Label>
          <Input id="eb-ft" type="text" inputMode="decimal" value={ft} onChange={(e) => setFt(e.target.value)} fullWidth />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="eb-vat" className="text-sm font-medium">
            VAT %
          </Label>
          <Input id="eb-vat" type="text" inputMode="decimal" value={vat} onChange={(e) => setVat(e.target.value)} fullWidth />
        </div>
      </div>

      <Card className="flex flex-col items-center gap-1 bg-brand-soft p-6 text-center text-brand">
        <p className="text-sm">ค่าไฟโดยประมาณ</p>
        <p className="text-4xl font-bold tabular-nums">{money(r.total)}</p>
        <p className="text-sm opacity-80">เฉลี่ย {money(r.perUnit)} บาท/หน่วย</p>
      </Card>

      {r.steps.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-3 py-2 text-left font-medium">ขั้น (หน่วย)</th>
                <th className="px-3 py-2 text-right font-medium">ใช้</th>
                <th className="px-3 py-2 text-right font-medium">บาท/หน่วย</th>
                <th className="px-3 py-2 text-right font-medium">เป็นเงิน</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {r.steps.map((s) => (
                <tr key={s.range} className="border-b border-border/50 last:border-0">
                  <td className="px-3 py-1.5">{s.range}</td>
                  <td className="px-3 py-1.5 text-right">{s.units.toLocaleString("th-TH")}</td>
                  <td className="px-3 py-1.5 text-right">{s.rate.toFixed(4)}</td>
                  <td className="px-3 py-1.5 text-right">{money(s.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card className="p-4 text-sm">
        <Row label="ค่าพลังงานไฟฟ้า" value={money(r.energy)} />
        <Row label="ค่าบริการรายเดือน" value={money(r.service)} />
        <Row label={`ค่า Ft (${num(ft).toFixed(4)} × ${r.u.toLocaleString("th-TH")} หน่วย)`} value={money(r.ftAmount)} />
        <div className="mt-2 border-t border-border pt-2">
          <Row label="รวมก่อน VAT" value={money(r.beforeVat)} />
          <Row label={`VAT (${num(vat)}%)`} value={money(r.vatAmount)} />
          <Row label="รวมสุทธิ" value={money(r.total)} strong />
        </div>
      </Card>

      <p className="text-xs text-muted">
        ประมาณการตามโครงสร้างอัตราก้าวหน้าของผู้ใช้ไฟประเภทบ้านอยู่อาศัย — ค่า Ft ปรับทุก 4 เดือน
        และอัตราอาจเปลี่ยนแปลง โปรดตรวจสอบกับ MEA/PEA หรือบิลจริงอีกครั้ง
      </p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className={strong ? "font-semibold text-foreground" : "text-muted"}>{label}</span>
      <span className={`tabular-nums ${strong ? "font-semibold" : ""}`}>{value} บาท</span>
    </div>
  );
}

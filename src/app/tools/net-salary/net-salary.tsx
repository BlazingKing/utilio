"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";

const BRACKETS: [number, number][] = [
  [150000, 0],
  [300000, 0.05],
  [500000, 0.1],
  [750000, 0.15],
  [1000000, 0.2],
  [2000000, 0.25],
  [5000000, 0.3],
  [Infinity, 0.35],
];

const PERSONAL = 60000;
const SSO_RATE = 0.05;
const SSO_BASE_CAP = 15000; // ฐานคำนวณสูงสุดต่อเดือน
const SSO_MONTHLY_CAP = 750;

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
}
function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function tax(taxable: number): number {
  let remaining = taxable;
  let prev = 0;
  let total = 0;
  for (const [cap, rate] of BRACKETS) {
    if (remaining <= 0) break;
    const amt = Math.min(remaining, cap - prev);
    total += amt * rate;
    remaining -= amt;
    prev = cap;
  }
  return total;
}

export function NetSalary() {
  const [salary, setSalary] = useState("30000");
  const [deductions, setDeductions] = useState("0");

  const r = useMemo(() => {
    const s = num(salary);
    const annual = s * 12;
    const ssoMonthly = Math.min(Math.min(s, SSO_BASE_CAP) * SSO_RATE, SSO_MONTHLY_CAP);
    const ssoAnnual = ssoMonthly * 12;
    const expense = Math.min(annual * 0.5, 100000);
    const other = num(deductions);
    const taxable = Math.max(0, annual - expense - PERSONAL - ssoAnnual - other);
    const taxAnnual = tax(taxable);
    const taxMonthly = taxAnnual / 12;
    const netMonthly = s - ssoMonthly - taxMonthly;
    return { s, annual, ssoMonthly, ssoAnnual, taxable, taxAnnual, taxMonthly, netMonthly };
  }, [salary, deductions]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ns-s" className="text-sm font-medium">
            เงินเดือน (บาท/เดือน)
          </Label>
          <Input id="ns-s" type="text" inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} fullWidth className="text-lg" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ns-d" className="text-sm font-medium">
            ค่าลดหย่อนอื่น ๆ ต่อปี (ประกัน, กองทุน ฯลฯ)
          </Label>
          <Input id="ns-d" type="text" inputMode="decimal" value={deductions} onChange={(e) => setDeductions(e.target.value)} fullWidth className="text-lg" />
        </div>
      </div>

      <Card className="flex flex-col items-center gap-1 bg-brand-soft p-6 text-center text-brand">
        <p className="text-sm">เงินเดือนสุทธิ (รับจริง)</p>
        <p className="text-4xl font-bold tabular-nums">{money(r.netMonthly)}</p>
        <p className="text-sm opacity-80">บาท/เดือน</p>
      </Card>

      <Card className="p-4 text-sm">
        <Row label="เงินเดือน (ก่อนหัก)" value={money(r.s)} />
        <Row label="หักประกันสังคม (5%)" value={`− ${money(r.ssoMonthly)}`} />
        <Row label="หักภาษี ณ ที่จ่าย" value={`− ${money(r.taxMonthly)}`} />
        <div className="mt-2 border-t border-border pt-2">
          <Row label="คงเหลือรับสุทธิ / เดือน" value={money(r.netMonthly)} strong />
        </div>
      </Card>

      <Card className="p-4 text-sm">
        <p className="mb-2 font-semibold text-muted">สรุปทั้งปี</p>
        <Row label="รายได้ทั้งปี" value={money(r.annual)} />
        <Row label="ประกันสังคมทั้งปี" value={money(r.ssoAnnual)} />
        <Row label="เงินได้สุทธิ (ฐานภาษี)" value={money(r.taxable)} />
        <Row label="ภาษีทั้งปี" value={money(r.taxAnnual)} />
      </Card>

      <p className="text-xs text-muted">
        ประมาณการสำหรับเงินเดือนประจำ (มาตรา 40(1)) หักประกันสังคมสูงสุด 750 บาท/เดือน — ไม่รวมกรณีซับซ้อน โปรดตรวจสอบกับกรมสรรพากร
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

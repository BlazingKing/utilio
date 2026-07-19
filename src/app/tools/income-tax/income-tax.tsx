"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";

/** ขั้นบันไดภาษีเงินได้บุคคลธรรมดา (บาท, อัตรา) */
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

const PERSONAL_ALLOWANCE = 60000;
const EXPENSE_RATE = 0.5;
const EXPENSE_CAP = 100000;

function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) ? 0 : n;
}

function calcTax(taxable: number) {
  let remaining = taxable;
  let prevCap = 0;
  let total = 0;
  const steps: { range: string; rate: number; amount: number; tax: number }[] = [];
  for (const [cap, rate] of BRACKETS) {
    if (remaining <= 0) break;
    const width = cap - prevCap;
    const amount = Math.min(remaining, width);
    const tax = amount * rate;
    total += tax;
    if (rate > 0) {
      steps.push({
        range: `${money(prevCap)}–${cap === Infinity ? "ขึ้นไป" : money(cap)}`,
        rate,
        amount,
        tax,
      });
    }
    remaining -= amount;
    prevCap = cap;
  }
  return { total, steps };
}

export function IncomeTax() {
  const [income, setIncome] = useState("600000");
  const [deductions, setDeductions] = useState("0");

  const result = useMemo(() => {
    const gross = num(income);
    const expense = Math.min(gross * EXPENSE_RATE, EXPENSE_CAP);
    const other = num(deductions);
    const taxable = Math.max(0, gross - expense - PERSONAL_ALLOWANCE - other);
    const { total, steps } = calcTax(taxable);
    const effective = gross > 0 ? (total / gross) * 100 : 0;
    return { gross, expense, other, taxable, total, steps, effective };
  }, [income, deductions]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="it-income" className="text-sm font-medium">
            เงินได้ทั้งปี (บาท)
          </Label>
          <Input
            id="it-income"
            type="text"
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="เช่น 600000"
            fullWidth
            className="text-lg"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="it-ded" className="text-sm font-medium">
            ค่าลดหย่อนอื่น ๆ (ประกัน, กองทุน, บุตร ฯลฯ)
          </Label>
          <Input
            id="it-ded"
            type="text"
            inputMode="decimal"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            placeholder="0"
            fullWidth
            className="text-lg"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="p-4 text-sm">
          <p className="mb-2 font-semibold text-muted">รายการหักลดหย่อน</p>
          <Row label="หักค่าใช้จ่าย (50% สูงสุด 1 แสน)" value={money(result.expense)} />
          <Row label="ลดหย่อนส่วนตัว" value={money(PERSONAL_ALLOWANCE)} />
          <Row label="ลดหย่อนอื่น ๆ" value={money(result.other)} />
          <div className="mt-2 border-t border-border pt-2">
            <Row label="เงินได้สุทธิ (ฐานภาษี)" value={money(result.taxable)} strong />
          </div>
        </Card>

        <Card className="flex flex-col justify-center gap-1 bg-brand-soft p-5 text-center text-brand">
          <p className="text-sm">ภาษีที่ต้องชำระโดยประมาณ</p>
          <p className="text-3xl font-bold tabular-nums">{money(result.total)}</p>
          <p className="text-sm opacity-80">อัตราภาษีเฉลี่ย {result.effective.toFixed(2)}%</p>
        </Card>
      </div>

      {result.steps.length > 0 && (
        <Card className="p-4 text-sm">
          <p className="mb-2 font-semibold text-muted">คำนวณตามขั้นบันได</p>
          <div className="flex flex-col gap-1">
            {result.steps.map((s) => (
              <div key={s.range} className="flex items-center justify-between gap-2">
                <span className="text-muted">
                  {s.range} <span className="text-xs">({(s.rate * 100).toFixed(0)}%)</span>
                </span>
                <span className="tabular-nums">{money(s.tax)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <p className="text-xs text-muted">
        เป็นการประมาณการเบื้องต้นสำหรับเงินได้ประเภทเงินเดือน (มาตรา 40(1)) เท่านั้น
        ไม่รวมกรณีซับซ้อน เช่น เครดิตภาษีเงินปันผล — โปรดตรวจสอบกับกรมสรรพากรอีกครั้ง
      </p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className={strong ? "font-semibold text-foreground" : "text-muted"}>{label}</span>
      <span className={`tabular-nums ${strong ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

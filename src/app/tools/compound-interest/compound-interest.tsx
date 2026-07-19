"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) || n < 0 ? 0 : n;
}

function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CompoundInterest() {
  const [principal, setPrincipal] = useState("100000");
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const P = num(principal);
    const PMT = num(monthly);
    const r = num(rate) / 100 / 12;
    const totalMonths = Math.floor(num(years) * 12);
    if (totalMonths <= 0) return null;

    let balance = P;
    let contributed = P;
    const yearly: { year: number; contributed: number; interest: number; balance: number }[] = [];
    for (let m = 1; m <= totalMonths; m++) {
      balance = balance * (1 + r) + PMT;
      contributed += PMT;
      if (m % 12 === 0 || m === totalMonths) {
        yearly.push({
          year: Math.ceil(m / 12),
          contributed,
          interest: balance - contributed,
          balance,
        });
      }
    }
    return {
      final: balance,
      contributed,
      interest: balance - contributed,
      yearly,
    };
  }, [principal, monthly, rate, years]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ci-p" label="เงินต้นเริ่มต้น (บาท)" value={principal} onChange={setPrincipal} />
        <Field id="ci-m" label="ฝากเพิ่มต่อเดือน (บาท)" value={monthly} onChange={setMonthly} />
        <Field id="ci-r" label="ดอกเบี้ยต่อปี (%)" value={rate} onChange={setRate} />
        <Field id="ci-y" label="ระยะเวลา (ปี)" value={years} onChange={setYears} />
      </div>

      {result && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="flex flex-col items-center gap-1 bg-brand-soft p-5 text-center text-brand">
              <p className="text-sm">มูลค่าเมื่อครบกำหนด</p>
              <p className="text-2xl font-bold tabular-nums">{money(result.final)}</p>
            </Card>
            <Card className="flex flex-col items-center justify-center gap-1 p-5 text-center">
              <p className="text-sm text-muted">เงินฝากสะสม</p>
              <p className="text-xl font-semibold tabular-nums">{money(result.contributed)}</p>
            </Card>
            <Card className="flex flex-col items-center justify-center gap-1 p-5 text-center">
              <p className="text-sm text-muted">ดอกเบี้ยที่ได้</p>
              <p className="text-xl font-semibold tabular-nums text-green-600 dark:text-green-400">
                {money(result.interest)}
              </p>
            </Card>
          </div>

          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-3 py-2 text-left font-medium">สิ้นปีที่</th>
                  <th className="px-3 py-2 text-right font-medium">เงินฝากสะสม</th>
                  <th className="px-3 py-2 text-right font-medium">ดอกเบี้ยสะสม</th>
                  <th className="px-3 py-2 text-right font-medium">ยอดรวม</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {result.yearly.map((y) => (
                  <tr key={y.year} className="border-b border-border/50 last:border-0">
                    <td className="px-3 py-1.5">{y.year}</td>
                    <td className="px-3 py-1.5 text-right">{money(y.contributed)}</td>
                    <td className="px-3 py-1.5 text-right text-green-600 dark:text-green-400">{money(y.interest)}</td>
                    <td className="px-3 py-1.5 text-right font-medium">{money(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      <p className="text-xs text-muted">คิดดอกเบี้ยทบต้นรายเดือน โดยฝากเพิ่มตอนสิ้นเดือน</p>
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

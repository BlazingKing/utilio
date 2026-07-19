"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) ? 0 : n;
}

function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function LoanCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("5");
  const [months, setMonths] = useState("360");

  const result = useMemo(() => {
    const P = num(principal);
    const annual = num(rate);
    const n = Math.floor(num(months));
    if (P <= 0 || n <= 0) return null;
    const r = annual / 100 / 12;
    const payment = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));
    const totalPaid = payment * n;
    const totalInterest = totalPaid - P;

    // ตารางผ่อน (เก็บทุกงวดไว้คำนวณ แต่จะแสดงบางส่วน)
    const schedule: { i: number; principalPart: number; interestPart: number; balance: number }[] = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r;
      const principalPart = payment - interestPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({ i, principalPart, interestPart, balance });
    }
    return { payment, totalPaid, totalInterest, schedule, n };
  }, [principal, rate, months]);

  const preview = result
    ? [...result.schedule.slice(0, 3), ...(result.n > 4 ? result.schedule.slice(-1) : [])]
    : [];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ln-p" className="text-sm font-medium">
            ยอดกู้ (บาท)
          </Label>
          <Input
            id="ln-p"
            type="text"
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ln-r" className="text-sm font-medium">
            ดอกเบี้ยต่อปี (%)
          </Label>
          <Input
            id="ln-r"
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ln-n" className="text-sm font-medium">
            จำนวนงวด (เดือน)
          </Label>
          <Input
            id="ln-n"
            type="text"
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            fullWidth
          />
        </div>
      </div>

      {result && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="flex flex-col items-center gap-1 bg-brand-soft p-5 text-center text-brand">
              <p className="text-sm">ค่างวดต่อเดือน</p>
              <p className="text-2xl font-bold tabular-nums">{money(result.payment)}</p>
            </Card>
            <Card className="flex flex-col items-center justify-center gap-1 p-5 text-center">
              <p className="text-sm text-muted">ดอกเบี้ยรวม</p>
              <p className="text-xl font-semibold tabular-nums">{money(result.totalInterest)}</p>
            </Card>
            <Card className="flex flex-col items-center justify-center gap-1 p-5 text-center">
              <p className="text-sm text-muted">ยอดชำระรวม</p>
              <p className="text-xl font-semibold tabular-nums">{money(result.totalPaid)}</p>
            </Card>
          </div>

          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-3 py-2 text-left font-medium">งวด</th>
                  <th className="px-3 py-2 text-right font-medium">เงินต้น</th>
                  <th className="px-3 py-2 text-right font-medium">ดอกเบี้ย</th>
                  <th className="px-3 py-2 text-right font-medium">คงเหลือ</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {preview.map((row, idx) => (
                  <tr key={row.i} className="border-b border-border/50 last:border-0">
                    <td className="px-3 py-1.5">
                      {idx === 3 && result.n > 4 ? `… ${row.i}` : row.i}
                    </td>
                    <td className="px-3 py-1.5 text-right">{money(row.principalPart)}</td>
                    <td className="px-3 py-1.5 text-right">{money(row.interestPart)}</td>
                    <td className="px-3 py-1.5 text-right">{money(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      <p className="text-xs text-muted">
        คำนวณแบบผ่อนเท่ากันทุกงวด (ลดต้นลดดอก / effective rate) — ค่างวดจริงของสถาบันการเงินอาจต่างกันเล็กน้อย
      </p>
    </div>
  );
}

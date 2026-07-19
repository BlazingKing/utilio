"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) ? 0 : n;
}

/** เกณฑ์สำหรับชาวเอเชีย (ที่ใช้ในไทย) */
function category(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "น้ำหนักน้อย / ผอม", color: "text-sky-600 dark:text-sky-400" };
  if (bmi < 23) return { label: "ปกติ (สมส่วน)", color: "text-green-600 dark:text-green-400" };
  if (bmi < 25) return { label: "ท้วม (น้ำหนักเกิน)", color: "text-amber-600 dark:text-amber-400" };
  if (bmi < 30) return { label: "อ้วนระดับ 1", color: "text-orange-600 dark:text-orange-400" };
  return { label: "อ้วนระดับ 2", color: "text-red-600 dark:text-red-400" };
}

export function BmiCalculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");

  const result = useMemo(() => {
    const h = num(height) / 100;
    const w = num(weight);
    if (h <= 0 || w <= 0) return null;
    const bmi = w / (h * h);
    const cat = category(bmi);
    const min = 18.5 * h * h;
    const max = 22.9 * h * h;
    return { bmi, cat, min, max };
  }, [height, weight]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bmi-h" className="text-sm font-medium">
            ส่วนสูง (ซม.)
          </Label>
          <Input
            id="bmi-h"
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            fullWidth
            className="text-lg"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bmi-w" className="text-sm font-medium">
            น้ำหนัก (กก.)
          </Label>
          <Input
            id="bmi-w"
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            fullWidth
            className="text-lg"
          />
        </div>
      </div>

      {result && (
        <>
          <Card className="flex flex-col items-center gap-1 p-6 text-center">
            <p className="text-sm text-muted">ค่าดัชนีมวลกาย (BMI)</p>
            <p className="text-5xl font-bold tabular-nums">{result.bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold ${result.cat.color}`}>{result.cat.label}</p>
          </Card>
          <Card className="p-4 text-center text-sm">
            น้ำหนักที่เหมาะสมสำหรับส่วนสูงนี้:{" "}
            <span className="font-semibold text-foreground tabular-nums">
              {result.min.toFixed(1)}–{result.max.toFixed(1)} กก.
            </span>
          </Card>
        </>
      )}

      <p className="text-xs text-muted">
        ใช้เกณฑ์ BMI สำหรับชาวเอเชีย (ปกติ 18.5–22.9) เป็นการประเมินเบื้องต้น
        ไม่ได้แทนคำวินิจฉัยของแพทย์
      </p>
    </div>
  );
}

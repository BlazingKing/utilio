"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";

const MONTHS = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const DOW = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

function parseField(field: string, min: number, max: number): Set<number> {
  const set = new Set<number>();
  for (const part of field.split(",")) {
    let range = part;
    let step = 1;
    if (part.includes("/")) {
      const [r, s] = part.split("/");
      range = r;
      step = parseInt(s, 10);
      if (isNaN(step) || step < 1) throw new Error("step ไม่ถูกต้อง");
    }
    let lo: number;
    let hi: number;
    if (range === "*") {
      lo = min;
      hi = max;
    } else if (range.includes("-")) {
      const [a, b] = range.split("-").map(Number);
      lo = a;
      hi = b;
    } else {
      lo = hi = Number(range);
    }
    if (isNaN(lo) || isNaN(hi) || lo < min || hi > max || lo > hi) {
      throw new Error(`ค่าอยู่นอกช่วง (${min}-${max})`);
    }
    for (let v = lo; v <= hi; v += step) set.add(v);
  }
  return set;
}

function describe(set: Set<number>, min: number, max: number, names?: string[], suffix = ""): string {
  if (set.size === max - min + 1) return "ทุกค่า";
  const vals = [...set].sort((a, b) => a - b);
  const shown = vals.map((v) => (names ? names[v] : String(v) + suffix));
  return shown.join(", ");
}

export function CronExplainer() {
  const [expr, setExpr] = useState("30 9 * * 1-5");

  const parsed = useMemo(() => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) {
      return { error: "cron ต้องมี 5 ช่อง: นาที ชั่วโมง วันของเดือน เดือน วันในสัปดาห์" };
    }
    try {
      const minute = parseField(parts[0], 0, 59);
      const hour = parseField(parts[1], 0, 23);
      const dom = parseField(parts[2], 1, 31);
      const month = parseField(parts[3], 1, 12);
      const dowRaw = parseField(parts[4].replace(/7/g, "0"), 0, 6);
      const domR = parts[2] !== "*";
      const dowR = parts[4] !== "*";

      const matches = (d: Date) => {
        if (!minute.has(d.getMinutes())) return false;
        if (!hour.has(d.getHours())) return false;
        if (!month.has(d.getMonth() + 1)) return false;
        const domOk = dom.has(d.getDate());
        const dowOk = dowRaw.has(d.getDay());
        if (domR && dowR) return domOk || dowOk;
        if (domR) return domOk;
        if (dowR) return dowOk;
        return true;
      };

      const runs: Date[] = [];
      const d = new Date();
      d.setSeconds(0, 0);
      d.setMinutes(d.getMinutes() + 1);
      let guard = 0;
      while (runs.length < 5 && guard < 527040) {
        guard++;
        if (matches(d)) runs.push(new Date(d));
        d.setMinutes(d.getMinutes() + 1);
      }

      return {
        rows: [
          { label: "นาที", value: describe(minute, 0, 59) },
          { label: "ชั่วโมง", value: describe(hour, 0, 23) },
          { label: "วันของเดือน", value: parts[2] === "*" ? "ทุกวัน" : describe(dom, 1, 31) },
          { label: "เดือน", value: describe(month, 1, 12, MONTHS) },
          { label: "วันในสัปดาห์", value: parts[4] === "*" ? "ทุกวัน" : describe(dowRaw, 0, 6, DOW) },
        ],
        runs,
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "cron ไม่ถูกต้อง" };
    }
  }, [expr]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cr-in" className="text-sm font-medium">
          Cron expression (5 ช่อง)
        </Label>
        <Input
          id="cr-in"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="30 9 * * 1-5"
          fullWidth
          className="font-mono text-lg"
          spellCheck={false}
        />
        <span className="text-xs text-muted">รูปแบบ: นาที ชั่วโมง วันของเดือน เดือน วันในสัปดาห์</span>
      </div>

      {"error" in parsed ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {parsed.error}
        </div>
      ) : (
        <>
          <Card className="p-4 text-sm">
            <p className="mb-2 font-semibold text-muted">ความหมาย</p>
            <div className="flex flex-col gap-1">
              {parsed.rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-2">
                  <span className="text-muted">{r.label}</span>
                  <span className="text-right font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 text-sm">
            <p className="mb-2 font-semibold text-muted">จะทำงานครั้งถัดไป</p>
            {parsed.runs.length === 0 ? (
              <p className="text-muted">ไม่พบเวลาที่ตรงภายใน 1 ปีข้างหน้า</p>
            ) : (
              <ol className="flex flex-col gap-1">
                {parsed.runs.map((d, i) => (
                  <li key={i} className="tabular-nums">
                    {d.toLocaleString("th-TH", { dateStyle: "full", timeStyle: "short" })}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

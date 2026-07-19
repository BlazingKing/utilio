"use client";

import { useMemo, useState } from "react";
import { Input, Card, Label } from "@heroui/react";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Mode = "age" | "between";

const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** ผลต่างเป็น ปี/เดือน/วัน จาก a ไป b (a <= b) */
function diffYMD(a: Date, b: Date) {
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months--;
    days += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export function AgeCalculator() {
  const [mode, setMode] = useState<Mode>("age");
  const [birth, setBirth] = useState("1995-01-01");
  const [start, setStart] = useState(todayStr());
  const [end, setEnd] = useState(todayStr());

  const ageResult = useMemo(() => {
    const b = new Date(birth + "T00:00:00");
    const now = new Date();
    if (isNaN(b.getTime()) || b > now) return null;
    const { years, months, days } = diffYMD(b, now);
    const totalDays = Math.floor((now.getTime() - b.getTime()) / 86400000);
    // วันเกิดถัดไป
    let next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (next < now) next = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate());
    const daysToNext = Math.ceil((next.getTime() - now.getTime()) / 86400000);
    return {
      years,
      months,
      days,
      totalDays,
      weekday: THAI_DAYS[b.getDay()],
      beYear: b.getFullYear() + 543,
      daysToNext,
    };
  }, [birth]);

  const betweenResult = useMemo(() => {
    const a = new Date(start + "T00:00:00");
    const b = new Date(end + "T00:00:00");
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const lo = a <= b ? a : b;
    const hi = a <= b ? b : a;
    const totalDays = Math.round((hi.getTime() - lo.getTime()) / 86400000);
    const { years, months, days } = diffYMD(lo, hi);
    return { totalDays, weeks: Math.floor(totalDays / 7), years, months, days };
  }, [start, end]);

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="โหมด"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "age", label: "คำนวณอายุ" },
          { value: "between", label: "นับวันระหว่างวันที่" },
        ]}
      />

      {mode === "age" ? (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ac-birth" className="text-sm font-medium">
              วันเกิด
            </Label>
            <Input
              id="ac-birth"
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              className="w-auto"
            />
          </div>

          {ageResult ? (
            <>
              <Card className="flex flex-col items-center gap-1 bg-brand-soft p-6 text-center text-brand">
                <p className="text-sm">อายุปัจจุบัน</p>
                <p className="text-3xl font-bold">
                  {ageResult.years} ปี {ageResult.months} เดือน {ageResult.days} วัน
                </p>
              </Card>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="รวมทั้งหมด" value={`${ageResult.totalDays.toLocaleString()} วัน`} />
                <Stat label="เกิดวัน" value={`วัน${ageResult.weekday}`} />
                <Stat label="ปีเกิด (พ.ศ.)" value={String(ageResult.beYear)} />
                <Stat
                  label="วันเกิดถัดไป"
                  value={ageResult.daysToNext === 0 ? "วันนี้! 🎉" : `อีก ${ageResult.daysToNext} วัน`}
                />
              </div>
            </>
          ) : (
            <Card className="px-4 py-8 text-center text-sm text-muted">
              เลือกวันเกิดที่ไม่เกินวันนี้
            </Card>
          )}
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ac-start" className="text-sm font-medium">
                วันเริ่มต้น
              </Label>
              <Input
                id="ac-start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ac-end" className="text-sm font-medium">
                วันสิ้นสุด
              </Label>
              <Input
                id="ac-end"
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>

          {betweenResult && (
            <>
              <Card className="flex flex-col items-center gap-1 bg-brand-soft p-6 text-center text-brand">
                <p className="text-sm">ระยะห่าง</p>
                <p className="text-3xl font-bold">{betweenResult.totalDays.toLocaleString()} วัน</p>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="คิดเป็นสัปดาห์" value={`${betweenResult.weeks.toLocaleString()} สัปดาห์`} />
                <Stat
                  label="คิดเป็น ปี/เดือน/วัน"
                  value={`${betweenResult.years} ปี ${betweenResult.months} เดือน ${betweenResult.days} วัน`}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 text-center">
      <div className="font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </Card>
  );
}

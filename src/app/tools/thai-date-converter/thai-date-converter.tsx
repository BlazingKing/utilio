"use client";

import { useMemo, useState } from "react";
import { Input, Card } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

const BE_OFFSET = 543;

export function ThaiDateConverter() {
  // ส่วนที่ 1: แปลงปีอย่างเดียว
  const [year, setYear] = useState("2025");
  const [yearMode, setYearMode] = useState<"ad2be" | "be2ad">("ad2be");
  const convertedYear = useMemo(() => {
    const n = parseInt(year, 10);
    if (isNaN(n)) return null;
    return yearMode === "ad2be" ? n + BE_OFFSET : n - BE_OFFSET;
  }, [year, yearMode]);

  // ส่วนที่ 2: จัดรูปแบบวันที่แบบไทย
  const today = new Date();
  const [dateStr, setDateStr] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
  );

  const formatted = useMemo(() => {
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    const day = d.getDate();
    const month = THAI_MONTHS[d.getMonth()];
    const beYear = d.getFullYear() + BE_OFFSET;
    const weekday = THAI_DAYS[d.getDay()];
    return {
      full: `วัน${weekday}ที่ ${day} ${month} พ.ศ. ${beYear}`,
      short: `${day}/${d.getMonth() + 1}/${beYear}`,
      long: `${day} ${month} ${beYear}`,
    };
  }, [dateStr]);

  return (
    <div className="flex flex-col gap-6">
      {/* แปลงปี */}
      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted">แปลงปี</h3>
        <SegmentedControl
          className="mb-3"
          aria-label="ทิศทางการแปลงปี"
          value={yearMode}
          onChange={(v) => setYearMode(v as "ad2be" | "be2ad")}
          options={[
            { value: "ad2be", label: "ค.ศ. → พ.ศ." },
            { value: "be2ad", label: "พ.ศ. → ค.ศ." },
          ]}
        />
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-32 text-center text-lg"
            aria-label="ปี"
          />
          <span className="text-muted">=</span>
          <div className="rounded-xl bg-brand-soft px-4 py-2 text-lg font-semibold text-brand">
            {convertedYear ?? "—"}
          </div>
          <span className="text-sm text-muted">{yearMode === "ad2be" ? "พ.ศ." : "ค.ศ."}</span>
        </div>
      </Card>

      {/* จัดรูปแบบวันที่ */}
      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted">จัดรูปแบบวันที่แบบไทย</h3>
        <Input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="mb-4 w-auto"
          aria-label="เลือกวันที่"
        />
        {formatted && (
          <div className="flex flex-col gap-2">
            {[
              { label: "เต็ม", value: formatted.full },
              { label: "ยาว", value: formatted.long },
              { label: "สั้น", value: formatted.short },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2">
                <div className="min-w-0">
                  <span className="mr-2 text-xs text-muted">{f.label}</span>
                  <span className="font-medium">{f.value}</span>
                </div>
                <CopyButton value={f.value} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

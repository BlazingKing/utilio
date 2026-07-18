"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

/** ตรวจสอบเลขบัตรประชาชนไทย 13 หลักด้วย checksum */
function validateThaiId(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id[i], 10) * (13 - i);
  }
  const check = (11 - (sum % 11)) % 10;
  return check === parseInt(id[12], 10);
}

function formatId(digits: string): string {
  // รูปแบบ x-xxxx-xxxxx-xx-x
  const p = digits.padEnd(13, " ").slice(0, 13);
  return [p[0], p.slice(1, 5), p.slice(5, 10), p.slice(10, 12), p[12]]
    .join("-")
    .replace(/-+$/, "")
    .replace(/\s/g, "");
}

export function ThaiIdChecker() {
  const [raw, setRaw] = useState("");

  const digits = raw.replace(/\D/g, "").slice(0, 13);
  const complete = digits.length === 13;

  const valid = useMemo(() => (complete ? validateThaiId(digits) : null), [digits, complete]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="id-in" className="mb-1.5 block text-sm font-medium">
          เลขบัตรประชาชน (13 หลัก)
        </label>
        <input
          id="id-in"
          type="text"
          inputMode="numeric"
          value={formatId(digits)}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="x-xxxx-xxxxx-xx-x"
          className="field text-center font-mono text-lg tracking-wider"
        />
        <p className="mt-1.5 text-right text-xs text-muted">{digits.length}/13 หลัก</p>
      </div>

      {complete && (
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-4 ${
            valid
              ? "border-green-300 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
              : "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {valid ? <CheckCircle2 className="h-7 w-7 shrink-0" /> : <XCircle className="h-7 w-7 shrink-0" />}
          <div>
            <p className="font-semibold">{valid ? "เลขบัตรถูกต้อง" : "เลขบัตรไม่ถูกต้อง"}</p>
            <p className="text-sm opacity-80">
              {valid
                ? "ผ่านการตรวจสอบ checksum (หลักที่ 13 ตรงกับที่คำนวณได้)"
                : "หลักตรวจสอบไม่ตรงกับที่คำนวณจาก 12 หลักแรก"}
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted">
        หมายเหตุ: ตรวจสอบเฉพาะความถูกต้องทางคณิตศาสตร์ (checksum) เท่านั้น ไม่ได้ยืนยันว่ามีบุคคลนี้อยู่จริง
        ข้อมูลไม่ถูกส่งออกจากเครื่องคุณ
      </p>
    </div>
  );
}

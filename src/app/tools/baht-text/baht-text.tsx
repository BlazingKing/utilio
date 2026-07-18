"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const NUMBERS = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
const UNITS = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน"];

/** อ่านกลุ่มตัวเลขไม่เกิน 6 หลัก; hasHigher = มีหลักล้านที่สูงกว่าอยู่หรือไม่ */
function readGroup(numStr: string, hasHigher: boolean): string {
  const trimmed = numStr.replace(/^0+/, "");
  if (trimmed === "") return "";
  const digits = trimmed.split("").map(Number);
  const len = digits.length;
  let result = "";
  for (let i = 0; i < len; i++) {
    const d = digits[i];
    const pos = len - i - 1; // 0=หน่วย, 1=สิบ, ...
    if (d === 0) continue;
    if (pos === 0) {
      result += d === 1 && (len > 1 || hasHigher) ? "เอ็ด" : NUMBERS[d];
    } else if (pos === 1) {
      result += d === 1 ? "สิบ" : d === 2 ? "ยี่สิบ" : NUMBERS[d] + "สิบ";
    } else {
      result += NUMBERS[d] + UNITS[pos];
    }
  }
  return result;
}

/** อ่านจำนวนเต็มความยาวเท่าใดก็ได้ โดยใช้หลัก "ล้าน" */
function readInteger(numStr: string, hasHigher = false): string {
  const trimmed = numStr.replace(/^0+/, "");
  if (trimmed === "") return "";
  if (trimmed.length > 6) {
    const head = trimmed.slice(0, trimmed.length - 6);
    const tail = trimmed.slice(trimmed.length - 6);
    return readInteger(head, hasHigher) + "ล้าน" + readGroup(tail, true);
  }
  return readGroup(trimmed, hasHigher);
}

function bahtText(amount: string): string {
  const cleaned = amount.replace(/[,\s]/g, "");
  if (cleaned === "" || isNaN(Number(cleaned))) return "";
  const fixed = Math.abs(Number(cleaned)).toFixed(2);
  const negative = Number(cleaned) < 0;
  const [baht, satang] = fixed.split(".");

  let text = "";
  if (Number(baht) === 0 && Number(satang) === 0) return "ศูนย์บาทถ้วน";
  if (Number(baht) > 0) text += readInteger(baht) + "บาท";
  if (Number(satang) === 0) text += "ถ้วน";
  else text += readInteger(satang) + "สตางค์";

  return (negative ? "ลบ" : "") + text;
}

export function BahtText() {
  const [value, setValue] = useState("1250.50");

  const result = useMemo(() => bahtText(value), [value]);
  const preview = useMemo(() => {
    const n = Number(value.replace(/[,\s]/g, ""));
    return isNaN(n) ? null : n.toLocaleString("th-TH", { minimumFractionDigits: 2 });
  }, [value]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="baht-in" className="mb-1.5 block text-sm font-medium">
          จำนวนเงิน (บาท)
        </label>
        <input
          id="baht-in"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="เช่น 1250.50"
          className="field text-lg"
        />
        {preview && (
          <p className="mt-1.5 text-sm text-muted">
            = <span className="tabular-nums">{preview}</span> บาท
          </p>
        )}
      </div>

      <div className="card p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-muted">ผลลัพธ์</span>
          <CopyButton value={result} className="btn-ghost !px-2.5 !py-1 text-xs" />
        </div>
        <p className="text-lg font-medium leading-relaxed">
          {result || <span className="text-muted">กรอกจำนวนเงินที่ถูกต้อง</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {["0", "25", "108", "1000000", "1234.75", "1000001"].map((ex) => (
          <button
            key={ex}
            onClick={() => setValue(ex)}
            className="btn-ghost justify-start !py-1.5 text-xs"
          >
            {Number(ex).toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}

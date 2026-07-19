"use client";

import { useMemo, useState } from "react";
import { Input, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

const VAT_RATE = 0.07;

type Mode = "add" | "extract";

function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function VatCalculator() {
  const [mode, setMode] = useState<Mode>("extract");
  const [amount, setAmount] = useState("1070");

  const result = useMemo(() => {
    const n = Number(amount.replace(/[,\s]/g, ""));
    if (!amount.trim() || isNaN(n)) return null;
    if (mode === "add") {
      const base = n;
      const vat = base * VAT_RATE;
      return { base, vat, total: base + vat };
    }
    // extract: amount รวม VAT แล้ว
    const base = n / (1 + VAT_RATE);
    return { base, vat: n - base, total: n };
  }, [amount, mode]);

  const rows = result
    ? [
        { label: "ราคาก่อนภาษี", value: result.base, strong: mode === "extract" },
        { label: "ภาษีมูลค่าเพิ่ม (7%)", value: result.vat, strong: false },
        { label: "ราคารวม VAT", value: result.total, strong: mode === "add" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="โหมดคำนวณ VAT"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "extract", label: "แยก VAT จากราคารวม" },
          { value: "add", label: "บวก VAT เข้าราคาก่อนภาษี" },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="vat-in" className="text-sm font-medium">
          {mode === "add" ? "ราคาก่อนภาษี (บาท)" : "ราคารวม VAT (บาท)"}
        </Label>
        <Input
          id="vat-in"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="เช่น 1070"
          fullWidth
          className="text-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface-2 px-4 py-6 text-center text-sm text-muted">
            กรอกจำนวนเงินที่ถูกต้อง
          </div>
        ) : (
          rows.map((r) => (
            <div
              key={r.label}
              className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 ${
                r.strong ? "bg-brand-soft text-brand" : "bg-surface-2"
              }`}
            >
              <span className="text-sm text-muted">{r.label}</span>
              <div className="flex items-center gap-2">
                <span className={`tabular-nums ${r.strong ? "text-lg font-bold" : "font-medium"}`}>
                  {money(r.value)}
                </span>
                <CopyButton value={r.value.toFixed(2)} label="" />
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted">
        อัตราภาษีมูลค่าเพิ่มมาตรฐานของไทยคือ 7% การคำนวณทั้งหมดทำในเบราว์เซอร์
      </p>
    </div>
  );
}

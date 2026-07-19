"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Input, Button, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Target = "phone" | "id";

/** สร้าง field ตามรูปแบบ EMVCo: ID(2) + LEN(2) + VALUE */
function tlv(id: string, value: string): string {
  return id + value.length.toString().padStart(2, "0") + value;
}

/** CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildPayload(digits: string, target: Target, amount: number | null): string {
  const AID = "A000000677010111";
  const account =
    target === "id"
      ? tlv("00", AID) + tlv("02", digits)
      : tlv("00", AID) + tlv("01", "0066" + digits.replace(/^0/, ""));

  const hasAmount = amount != null && amount > 0;
  let payload =
    tlv("00", "01") +
    tlv("01", hasAmount ? "12" : "11") +
    tlv("29", account) +
    tlv("53", "764") +
    (hasAmount ? tlv("54", amount!.toFixed(2)) : "") +
    tlv("58", "TH") +
    "6304";
  return payload + crc16(payload);
}

export function PromptPayQr() {
  const [target, setTarget] = useState<Target>("phone");
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [payload, setPayload] = useState("");

  const digits = value.replace(/\D/g, "");
  const valid = target === "id" ? digits.length === 13 : digits.length === 9 || digits.length === 10;
  const amountNum = amount.trim() ? Number(amount.replace(/[,\s]/g, "")) : null;

  useEffect(() => {
    if (!valid) {
      setDataUrl("");
      setPayload("");
      return;
    }
    const p = buildPayload(digits, target, amountNum != null && !isNaN(amountNum) ? amountNum : null);
    setPayload(p);
    let cancelled = false;
    QRCode.toDataURL(p, { width: 512, margin: 2, errorCorrectionLevel: "M" }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [digits, target, amountNum, valid]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "promptpay-qr.png";
    a.click();
  }

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="ประเภทพร้อมเพย์"
        value={target}
        onChange={(v) => setTarget(v as Target)}
        options={[
          { value: "phone", label: "เบอร์มือถือ" },
          { value: "id", label: "เลขบัตรประชาชน" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pp-target" className="text-sm font-medium">
            {target === "id" ? "เลขบัตรประชาชน / เลขผู้เสียภาษี (13 หลัก)" : "เบอร์พร้อมเพย์"}
          </Label>
          <Input
            id="pp-target"
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={target === "id" ? "1234567890123" : "081-234-5678"}
            fullWidth
            className="font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pp-amount" className="text-sm font-medium">
            จำนวนเงิน (บาท) — ไม่ระบุก็ได้
          </Label>
          <Input
            id="pp-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="เช่น 100.00"
            fullWidth
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {!valid ? (
          <p className="text-sm text-muted">
            {target === "id" ? "กรอกเลขบัตรประชาชนให้ครบ 13 หลัก" : "กรอกเบอร์มือถือให้ถูกต้อง"}
          </p>
        ) : dataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="PromptPay QR"
              className="w-72 max-w-full rounded-2xl border border-border bg-white p-3"
            />
            <div className="flex items-center gap-2">
              <Button variant="primary" onPress={download}>
                <Download className="h-4 w-4" /> ดาวน์โหลด PNG
              </Button>
              <CopyButton value={payload} label="คัดลอก payload" variant="secondary" size="md" />
            </div>
          </>
        ) : null}
      </div>

      <p className="text-xs text-muted">
        QR เป็นไปตามมาตรฐาน EMVCo/พร้อมเพย์ สร้างในเบราว์เซอร์ ไม่ส่งข้อมูลออก — โปรดตรวจสอบชื่อผู้รับในแอปธนาคารก่อนโอนทุกครั้ง
      </p>
    </div>
  );
}

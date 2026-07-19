"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { TextArea, Button, Label } from "@heroui/react";
import { AppSlider } from "@/components/ui/slider";

export function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(320);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text) return;
    let cancelled = false;
    QRCode.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: "M" })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("ข้อความยาวเกินไปสำหรับสร้าง QR");
      });
    return () => {
      cancelled = true;
    };
  }, [text, size]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "utilio-qrcode.png";
    a.click();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="qr-in" className="text-sm font-medium">
          ข้อความหรือ URL
        </Label>
        <TextArea
          id="qr-in"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความหรือวางลิงก์..."
          rows={3}
          fullWidth
          className="resize-y"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">ขนาด: {size}px</Label>
        <AppSlider
          aria-label="ขนาด QR"
          value={size}
          onChange={setSize}
          minValue={128}
          maxValue={640}
          step={32}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        {!text ? (
          <p className="text-sm text-muted">กรอกข้อความเพื่อสร้าง QR</p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : dataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="QR code"
              className="rounded-2xl border border-border bg-white p-2"
              style={{ width: Math.min(size, 320), height: Math.min(size, 320) }}
            />
            <Button variant="primary" onPress={download}>
              <Download className="h-4 w-4" /> ดาวน์โหลด PNG
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted">กรอกข้อความเพื่อสร้าง QR</p>
        )}
      </div>
    </div>
  );
}

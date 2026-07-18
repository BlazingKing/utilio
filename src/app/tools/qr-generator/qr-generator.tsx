"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export function QrGenerator() {
  const [text, setText] = useState("https://github.com/BlazingKing/utilio");
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
      <div>
        <label htmlFor="qr-in" className="mb-1.5 block text-sm font-medium">
          ข้อความหรือ URL
        </label>
        <textarea
          id="qr-in"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความหรือวางลิงก์..."
          rows={3}
          className="field resize-y"
        />
      </div>

      <div>
        <label htmlFor="qr-size" className="mb-1.5 block text-sm font-medium">
          ขนาด: {size}px
        </label>
        <input
          id="qr-size"
          type="range"
          min={128}
          max={640}
          step={32}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full accent-[var(--brand)]"
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
            <button onClick={download} className="btn-primary">
              <Download className="h-4 w-4" /> ดาวน์โหลด PNG
            </button>
          </>
        ) : (
          <p className="text-sm text-muted">กรอกข้อความเพื่อสร้าง QR</p>
        )}
      </div>
    </div>
  );
}

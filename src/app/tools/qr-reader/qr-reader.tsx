"use client";

import { useRef, useState } from "react";
import jsQR from "jsqr";
import { ScanLine, ExternalLink } from "lucide-react";
import { Card } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";

export function QrReader() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // จำกัดขนาดเพื่อความเร็ว แต่คงความละเอียดพอสำหรับถอด QR
      const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height);
      if (code && code.data) setResult(code.data);
      else setError("ไม่พบ QR Code ในรูปภาพ ลองใช้รูปที่ชัดขึ้นหรือครอบให้เห็น QR เต็ม");
    };
    img.onerror = () => setError("ไม่สามารถอ่านไฟล์รูปภาพได้");
    img.src = url;
  }

  const isUrl = result ? /^https?:\/\//i.test(result.trim()) : false;

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-surface p-8 text-muted transition-colors hover:border-brand hover:text-brand"
      >
        <ScanLine className="h-8 w-8" />
        <span className="text-sm font-medium">คลิกเพื่อเลือกรูปภาพที่มี QR Code</span>
        <span className="text-xs">ประมวลผลในเบราว์เซอร์ ไม่อัปโหลดขึ้นเซิร์ฟเวอร์</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="รูปที่อัปโหลด" className="max-h-56 rounded-xl border border-border" />
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {result && (
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted">ผลลัพธ์</span>
            <CopyButton value={result} />
          </div>
          <p className="break-all font-mono text-sm">{result}</p>
          {isUrl && (
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-2 inline-flex items-center gap-1 text-sm text-brand hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> เปิดลิงก์ในแท็บใหม่
            </a>
          )}
        </Card>
      )}
    </div>
  );
}

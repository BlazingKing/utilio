"use client";

import { useRef, useState } from "react";
import { FileImage } from "lucide-react";
import { TextArea, Card } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageBase64() {
  const [dataUrl, setDataUrl] = useState("");
  const [info, setInfo] = useState<{ name: string; size: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setInfo({ name: file.name, size: file.size });
    const reader = new FileReader();
    reader.onload = () => setDataUrl(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-surface p-8 text-muted transition-colors hover:border-brand hover:text-brand"
      >
        <FileImage className="h-8 w-8" />
        <span className="text-sm font-medium">คลิกเพื่อเลือกรูปภาพ</span>
        <span className="text-xs">แปลงเป็น Base64 / Data URI ในเบราว์เซอร์ ไม่อัปโหลดขึ้นเซิร์ฟเวอร์</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {dataUrl && (
        <>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="ตัวอย่าง" className="h-20 w-20 rounded-lg border border-border object-contain" />
            {info && (
              <div className="text-sm text-muted">
                <p className="font-medium text-foreground">{info.name}</p>
                <p className="tabular-nums">ต้นฉบับ {formatBytes(info.size)} · Data URI {formatBytes(dataUrl.length)}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data URI</span>
              <CopyButton value={dataUrl} />
            </div>
            <TextArea value={dataUrl} readOnly rows={6} fullWidth className="resize-y font-mono text-xs" spellCheck={false} />
          </div>

          <Card className="p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-muted">ใช้เป็น CSS background</span>
              <CopyButton value={`background-image: url("${dataUrl}");`} />
            </div>
            <code className="block truncate font-mono text-xs text-muted">background-image: url(&quot;{dataUrl.slice(0, 40)}…&quot;);</code>
          </Card>
        </>
      )}
    </div>
  );
}

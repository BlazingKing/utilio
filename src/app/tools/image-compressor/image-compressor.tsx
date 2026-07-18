"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ImageUp } from "lucide-react";

type Format = "image/jpeg" | "image/webp" | "image/png";

interface Source {
  name: string;
  size: number;
  width: number;
  height: number;
  img: HTMLImageElement;
}

interface Result {
  url: string;
  size: number;
  width: number;
  height: number;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageCompressor() {
  const [source, setSource] = useState<Source | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [maxWidth, setMaxWidth] = useState(1280);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setSource({ name: file.name, size: file.size, width: img.width, height: img.height, img });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  const compress = useCallback(() => {
    if (!source) return;
    const scale = Math.min(1, maxWidth / source.width);
    const w = Math.round(source.width * scale);
    const h = Math.round(source.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(source.img, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url: URL.createObjectURL(blob), size: blob.size, width: w, height: h };
        });
      },
      format,
      format === "image/png" ? undefined : quality,
    );
  }, [source, maxWidth, quality, format]);

  useEffect(() => {
    compress();
  }, [compress]);

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
  const saved = source && result ? 1 - result.size / source.size : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* พื้นที่อัปโหลด */}
      <button
        onClick={() => inputRef.current?.click()}
        className="card flex flex-col items-center gap-2 border-dashed p-8 text-muted transition-colors hover:border-brand hover:text-brand"
      >
        <ImageUp className="h-8 w-8" />
        <span className="text-sm font-medium">คลิกเพื่อเลือกรูปภาพ</span>
        <span className="text-xs">JPG, PNG, WebP — ประมวลผลในเบราว์เซอร์ ไม่อัปโหลดขึ้นเซิร์ฟเวอร์</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {source && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mw" className="mb-1.5 block text-sm font-medium">
                ความกว้างสูงสุด: {maxWidth}px
              </label>
              <input
                id="mw"
                type="range"
                min={320}
                max={3840}
                step={160}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full accent-[var(--brand)]"
              />
            </div>
            <div>
              <label htmlFor="fmt" className="mb-1.5 block text-sm font-medium">
                รูปแบบไฟล์
              </label>
              <select
                id="fmt"
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="field"
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
          </div>

          {format !== "image/png" && (
            <div>
              <label htmlFor="q" className="mb-1.5 block text-sm font-medium">
                คุณภาพ: {Math.round(quality * 100)}%
              </label>
              <input
                id="q"
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[var(--brand)]"
              />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="card p-4 text-sm">
              <p className="mb-1 font-semibold text-muted">ต้นฉบับ</p>
              <p>{source.width} × {source.height}px</p>
              <p className="tabular-nums">{formatBytes(source.size)}</p>
            </div>
            <div className="card p-4 text-sm">
              <p className="mb-1 font-semibold text-muted">หลังบีบอัด</p>
              {result ? (
                <>
                  <p>{result.width} × {result.height}px</p>
                  <p className="tabular-nums">
                    {formatBytes(result.size)}
                    {saved > 0 && (
                      <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                        −{Math.round(saved * 100)}%
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-muted">กำลังประมวลผล...</p>
              )}
            </div>
          </div>

          {result && (
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="ผลลัพธ์"
                className="max-h-80 rounded-2xl border border-border"
              />
              <a href={result.url} download={`compressed.${ext}`} className="btn-primary">
                <Download className="h-4 w-4" /> ดาวน์โหลด
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

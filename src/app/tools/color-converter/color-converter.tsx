"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorConverter() {
  const [hex, setHex] = useState("#6366f1");

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);

  const valid = rgb !== null;
  const normalizedHex = valid ? rgbToHex(rgb!.r, rgb!.g, rgb!.b) : "#000000";
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";

  function randomColor() {
    const n = Math.floor(Math.random() * 0xffffff);
    setHex("#" + n.toString(16).padStart(6, "0"));
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex h-32 items-end justify-end rounded-2xl border border-border p-3"
        style={{ background: valid ? normalizedHex : "var(--surface-2)" }}
      >
        {!valid && <span className="text-sm text-muted">ค่าสีไม่ถูกต้อง</span>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={valid ? normalizedHex : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-surface p-1"
          aria-label="เลือกสี"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#6366f1"
          className="field w-40 font-mono"
        />
        <button onClick={randomColor} className="btn-ghost">
          <Shuffle className="h-4 w-4" /> สุ่มสี
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <ValueRow label="HEX" value={valid ? normalizedHex : ""} />
        <ValueRow label="RGB" value={rgbStr} />
        <ValueRow label="HSL" value={hslStr} />
      </div>
    </div>
  );
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span className="w-12 text-xs font-semibold text-muted">{label}</span>
        <code className="font-mono text-sm">{value || "—"}</code>
      </div>
      <CopyButton value={value} className="btn-ghost !px-2 !py-1 text-xs" />
    </div>
  );
}

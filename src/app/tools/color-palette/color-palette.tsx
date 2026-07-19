"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { Input, Button } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  const m = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}
function mix(c: RGB, target: number, ratio: number): RGB {
  return {
    r: c.r + (target - c.r) * ratio,
    g: c.g + (target - c.g) * ratio,
    b: c.b + (target - c.b) * ratio,
  };
}
function luminance({ r, g, b }: RGB): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

const STOPS: { name: string; target: number; ratio: number }[] = [
  { name: "50", target: 255, ratio: 0.9 },
  { name: "100", target: 255, ratio: 0.75 },
  { name: "200", target: 255, ratio: 0.55 },
  { name: "300", target: 255, ratio: 0.35 },
  { name: "400", target: 255, ratio: 0.17 },
  { name: "500", target: 255, ratio: 0 },
  { name: "600", target: 0, ratio: 0.15 },
  { name: "700", target: 0, ratio: 0.3 },
  { name: "800", target: 0, ratio: 0.45 },
  { name: "900", target: 0, ratio: 0.6 },
];

export function ColorPalette() {
  const [hex, setHex] = useState("#6366f1");
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const valid = rgb !== null;
  const base = rgb ?? { r: 99, g: 102, b: 241 };

  const scale = useMemo(
    () => STOPS.map((s) => ({ name: s.name, hex: rgbToHex(mix(base, s.target, s.ratio)) })),
    [base.r, base.g, base.b], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const cssVars = scale.map((s) => `  --color-${s.name}: ${s.hex};`).join("\n");

  function randomColor() {
    setHex("#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={valid ? rgbToHex(base) : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-surface p-1"
          aria-label="เลือกสีหลัก"
        />
        <Input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#6366f1"
          aria-label="สีหลัก HEX"
          className="w-40 font-mono"
        />
        <Button variant="secondary" onPress={randomColor}>
          <Shuffle className="h-4 w-4" /> สุ่มสี
        </Button>
      </div>

      {valid ? (
        <>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {scale.map((s) => {
              const light = luminance(hexToRgb(s.hex)!) > 0.55;
              return (
                <button
                  key={s.name}
                  onClick={() => navigator.clipboard?.writeText(s.hex)}
                  className="flex aspect-square flex-col items-center justify-center rounded-lg text-[10px] font-medium transition-transform hover:scale-105"
                  style={{ background: s.hex, color: light ? "#000" : "#fff" }}
                  title={`คลิกเพื่อคัดลอก ${s.hex}`}
                >
                  <span>{s.name}</span>
                  <span className="font-mono">{s.hex.replace("#", "")}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ตัวแปร CSS</span>
              <CopyButton value={`:root {\n${cssVars}\n}`} label="คัดลอก CSS" />
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border bg-surface-2 p-3 font-mono text-xs">
{`:root {\n${cssVars}\n}`}
            </pre>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted">กรอกค่าสี HEX ที่ถูกต้อง (เช่น #6366f1)</p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input, Card, Label } from "@heroui/react";

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) || n <= 0 ? 0 : n;
}
function gcd(a: number, b: number): number {
  a = Math.round(a);
  b = Math.round(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
function round(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function AspectRatio() {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");
  const [rw, setRw] = useState("1280");
  const [rh, setRh] = useState("720");

  const W = num(w);
  const H = num(h);
  const ratio = W && H ? `${W / gcd(W, H)} : ${H / gcd(W, H)}` : "—";
  const dec = W && H ? (W / H).toFixed(3) : "—";

  function onRw(v: string) {
    setRw(v);
    if (W && H && num(v)) setRh(round((num(v) * H) / W));
  }
  function onRh(v: string) {
    setRh(v);
    if (W && H && num(v)) setRw(round((num(v) * W) / H));
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-sm font-medium">ขนาดต้นฉบับ</p>
        <div className="flex items-end gap-2">
          <Field id="ar-w" label="กว้าง" value={w} onChange={setW} />
          <X className="mb-2.5 h-4 w-4 shrink-0 text-muted" />
          <Field id="ar-h" label="สูง" value={h} onChange={setH} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center gap-1 bg-brand-soft p-5 text-center text-brand">
          <p className="text-sm">อัตราส่วน</p>
          <p className="text-3xl font-bold tabular-nums">{ratio}</p>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-1 p-5 text-center">
          <p className="text-sm text-muted">ทศนิยม (กว้าง ÷ สูง)</p>
          <p className="text-2xl font-semibold tabular-nums">{dec}</p>
        </Card>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">คำนวณขนาดใหม่ (รักษาสัดส่วนเดิม)</p>
        <div className="flex items-end gap-2">
          <Field id="ar-rw" label="กว้างใหม่" value={rw} onChange={onRw} />
          <X className="mb-2.5 h-4 w-4 shrink-0 text-muted" />
          <Field id="ar-rh" label="สูงใหม่" value={rh} onChange={onRh} />
        </div>
        <p className="mt-2 text-xs text-muted">แก้ช่องใดช่องหนึ่ง อีกช่องจะคำนวณให้อัตโนมัติตามสัดส่วนต้นฉบับ</p>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input id={id} type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} fullWidth />
    </div>
  );
}

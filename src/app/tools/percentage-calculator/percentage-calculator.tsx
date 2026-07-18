"use client";

import { useState } from "react";

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return parseFloat(n.toFixed(4)).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}

function num(v: string): number | null {
  if (v.trim() === "") return null;
  const n = parseFloat(v);
  return Number.isNaN(n) ? null : n;
}

/** ช่องกรอกตัวเลขเล็ก ๆ ใช้ซ้ำในแต่ละสูตร */
function NumInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="field w-24 text-center"
    />
  );
}

function ResultRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-xl bg-brand-soft px-4 py-2.5 text-center text-brand">
      {children}
    </div>
  );
}

export function PercentageCalculator() {
  // สูตร 1: X% ของ Y
  const [p1, setP1] = useState("10");
  const [n1, setN1] = useState("250");
  const r1 = num(p1) !== null && num(n1) !== null ? (num(p1)! / 100) * num(n1)! : null;

  // สูตร 2: X เป็นกี่ % ของ Y
  const [a2, setA2] = useState("25");
  const [b2, setB2] = useState("200");
  const r2 = num(a2) !== null && num(b2) ? (num(a2)! / num(b2)!) * 100 : null;

  // สูตร 3: เปลี่ยนจาก X เป็น Y คิดเป็นกี่ %
  const [x3, setX3] = useState("100");
  const [y3, setY3] = useState("125");
  const r3 = num(x3) && num(y3) !== null ? ((num(y3)! - num(x3)!) / num(x3)!) * 100 : null;

  return (
    <div className="flex flex-col gap-4">
      {/* สูตร 1 */}
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted">หาเปอร์เซ็นต์ของจำนวน</h3>
        <div className="flex flex-wrap items-center gap-2">
          <NumInput value={p1} onChange={setP1} /> <span>% ของ</span>
          <NumInput value={n1} onChange={setN1} /> <span>คือ ?</span>
        </div>
        <ResultRow>
          {p1 || "?"}% ของ {n1 || "?"} = <span className="font-bold">{r1 === null ? "—" : fmt(r1)}</span>
        </ResultRow>
      </div>

      {/* สูตร 2 */}
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted">คิดเป็นกี่เปอร์เซ็นต์</h3>
        <div className="flex flex-wrap items-center gap-2">
          <NumInput value={a2} onChange={setA2} /> <span>เป็นกี่ % ของ</span>
          <NumInput value={b2} onChange={setB2} /> <span>?</span>
        </div>
        <ResultRow>
          {a2 || "?"} เป็น <span className="font-bold">{r2 === null ? "—" : fmt(r2)}%</span> ของ {b2 || "?"}
        </ResultRow>
      </div>

      {/* สูตร 3 */}
      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted">เปลี่ยนแปลงกี่เปอร์เซ็นต์ (เพิ่ม/ลด)</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span>จาก</span> <NumInput value={x3} onChange={setX3} />
          <span>เป็น</span> <NumInput value={y3} onChange={setY3} />
        </div>
        <ResultRow>
          {r3 === null ? (
            "—"
          ) : (
            <span className="font-bold">
              {r3 >= 0 ? "เพิ่มขึ้น" : "ลดลง"} {fmt(Math.abs(r3))}%
            </span>
          )}
        </ResultRow>
      </div>
    </div>
  );
}

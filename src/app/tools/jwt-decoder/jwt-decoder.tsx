"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

function decodeSegment(seg: string): unknown {
  const b64 = seg.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

function tsToText(v: unknown): string | null {
  if (typeof v !== "number") return null;
  const d = new Date(v * 1000);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "medium" });
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  // จับเวลาปัจจุบันครั้งเดียวตอน mount เพื่อให้ render เป็น pure
  const [nowMs] = useState(() => Date.now());

  const decoded = useMemo(() => {
    const t = token.trim();
    if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2) return { error: "รูปแบบ JWT ไม่ถูกต้อง (ต้องมี 3 ส่วนคั่นด้วยจุด)" };
    try {
      const header = decodeSegment(parts[0]);
      const payload = decodeSegment(parts[1]) as Record<string, unknown>;
      return { header, payload };
    } catch {
      return { error: "ไม่สามารถถอดรหัส JWT ได้ (Base64 หรือ JSON ไม่ถูกต้อง)" };
    }
  }, [token]);

  const payloadObj =
    decoded && "payload" in decoded ? (decoded.payload as Record<string, unknown>) : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="jwt-in" className="mb-1.5 block text-sm font-medium">
          JWT
        </label>
        <textarea
          id="jwt-in"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          rows={4}
          className="field-mono resize-y"
          spellCheck={false}
        />
      </div>

      {decoded && "error" in decoded && (
        <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {decoded.error}
        </div>
      )}

      {decoded && "header" in decoded && (
        <>
          <Panel title="Header" value={decoded.header} />
          <Panel title="Payload" value={decoded.payload} />

          {payloadObj && (payloadObj.exp || payloadObj.iat || payloadObj.nbf) ? (
            <div className="card p-4 text-sm">
              <p className="mb-2 font-semibold text-muted">เวลา (แปลงจาก timestamp)</p>
              <div className="flex flex-col gap-1">
                {payloadObj.iat != null && <TimeRow label="ออกเมื่อ (iat)" value={tsToText(payloadObj.iat)} />}
                {payloadObj.nbf != null && <TimeRow label="ใช้ได้ตั้งแต่ (nbf)" value={tsToText(payloadObj.nbf)} />}
                {payloadObj.exp != null && (
                  <TimeRow
                    label="หมดอายุ (exp)"
                    value={tsToText(payloadObj.exp)}
                    expired={typeof payloadObj.exp === "number" && payloadObj.exp * 1000 < nowMs}
                  />
                )}
              </div>
            </div>
          ) : null}
        </>
      )}

      <p className="text-xs text-muted">
        เครื่องมือนี้ถอดดูเนื้อหาเท่านั้น ไม่ได้ตรวจสอบลายเซ็น (signature) การถอดรหัสทั้งหมดทำในเบราว์เซอร์ ไม่ส่งข้อมูลออก
      </p>
    </div>
  );
}

function Panel({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="chip">{title}</span>
        <CopyButton value={text} className="btn-ghost !px-2 !py-1 text-xs" />
      </div>
      <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-sm">{text}</pre>
    </div>
  );
}

function TimeRow({ label, value, expired }: { label: string; value: string | null; expired?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1">
      <span className="text-muted">{label}</span>
      <span className={expired ? "font-medium text-red-600 dark:text-red-400" : "font-medium"}>
        {value ?? "—"}
        {expired && " (หมดอายุแล้ว)"}
      </span>
    </div>
  );
}

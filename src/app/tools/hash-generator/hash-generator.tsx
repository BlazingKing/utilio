"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

async function digest(algo: Algo, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<Algo, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });

  useEffect(() => {
    if (!input) return;
    let cancelled = false;
    Promise.all(ALGOS.map(async (a) => [a, await digest(a, input)] as const)).then(
      (entries) => {
        if (!cancelled) setHashes(Object.fromEntries(entries) as Record<Algo, string>);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="hash-in" className="mb-1.5 block text-sm font-medium">
          ข้อความ
        </label>
        <textarea
          id="hash-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความที่ต้องการคำนวณ hash..."
          rows={4}
          className="field resize-y"
        />
      </div>

      <div className="flex flex-col gap-3">
        {ALGOS.map((a) => (
          <div key={a} className="card p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="chip">{a}</span>
              <CopyButton value={input ? hashes[a] : ""} className="btn-ghost !px-2 !py-1 text-xs" />
            </div>
            <code className="block break-all font-mono text-sm">
              {input && hashes[a] ? hashes[a] : <span className="text-muted">—</span>}
            </code>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted">
        คำนวณด้วย Web Crypto API ในเบราว์เซอร์ (หมายเหตุ: SHA-1 ไม่ปลอดภัยสำหรับงานเข้ารหัสสมัยใหม่)
      </p>
    </div>
  );
}

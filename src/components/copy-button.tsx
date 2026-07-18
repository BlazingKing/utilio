"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label = "คัดลอก",
  className = "btn-ghost",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard ไม่พร้อมใช้งาน — เงียบไว้
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={className} disabled={!value}>
      {copied ? (
        <>
          <Check className="h-4 w-4" /> คัดลอกแล้ว
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> {label}
        </>
      )}
    </button>
  );
}

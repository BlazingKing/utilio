"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@heroui/react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-soft";
type ButtonSize = "sm" | "md" | "lg";

export function CopyButton({
  value,
  label = "คัดลอก",
  variant = "tertiary",
  size = "sm",
  fullWidth,
}: {
  value: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
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
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onPress={handleCopy}
      isDisabled={!value}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" /> คัดลอกแล้ว
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> {label}
        </>
      )}
    </Button>
  );
}

"use client";

import { Tabs } from "@heroui/react";
import type { ReactNode } from "react";

export interface SegmentOption {
  value: string;
  label: ReactNode;
}

/** ตัวเลือกแบบแบ่งส่วน (segmented) — ครอบ HeroUI Tabs ใช้เป็นสวิตช์โหมด */
export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Tabs
      selectedKey={value}
      onSelectionChange={(key) => onChange(String(key))}
      className={className}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label={ariaLabel ?? "เลือกโหมด"}>
          {options.map((o) => (
            <Tabs.Tab key={o.value} id={o.value}>
              {o.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

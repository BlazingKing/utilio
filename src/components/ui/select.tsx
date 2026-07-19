"use client";

import { Select, ListBox, Label } from "@heroui/react";

export interface SelectOption {
  value: string;
  label: string;
}

/** ตัวเลือกแบบ dropdown — ครอบ compound API ของ HeroUI ให้เรียกใช้ง่าย */
export function AppSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
  "aria-label": ariaLabel,
}: {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Select
      className={className}
      placeholder={placeholder}
      aria-label={ariaLabel ?? label}
      selectedKey={value}
      onSelectionChange={(key) => onChange(String(key))}
    >
      {label ? <Label>{label}</Label> : null}
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((o) => (
            <ListBox.Item key={o.value} id={o.value} textValue={o.label}>
              {o.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

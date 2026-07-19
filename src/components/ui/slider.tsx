"use client";

import { Slider } from "@heroui/react";

/** แถบเลื่อนค่าตัวเลข — ครอบ compound API ของ HeroUI Slider */
export function AppSlider({
  value,
  onChange,
  minValue,
  maxValue,
  step = 1,
  className,
  "aria-label": ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  minValue: number;
  maxValue: number;
  step?: number;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Slider
      className={className}
      aria-label={ariaLabel}
      value={value}
      onChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
    >
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  );
}

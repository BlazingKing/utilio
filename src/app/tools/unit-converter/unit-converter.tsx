"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Input, Button, Label } from "@heroui/react";
import { AppSelect } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";

type CategoryKey = "length" | "weight" | "temperature";

/** หน่วยที่แปลงด้วยตัวคูณเทียบหน่วยฐาน */
interface LinearUnit {
  id: string;
  name: string;
  factor: number; // 1 หน่วยนี้ = factor หน่วยฐาน
}

const linearCategories: Record<
  Exclude<CategoryKey, "temperature">,
  { label: string; units: LinearUnit[] }
> = {
  length: {
    label: "ความยาว",
    units: [
      { id: "mm", name: "มิลลิเมตร (mm)", factor: 0.001 },
      { id: "cm", name: "เซนติเมตร (cm)", factor: 0.01 },
      { id: "m", name: "เมตร (m)", factor: 1 },
      { id: "km", name: "กิโลเมตร (km)", factor: 1000 },
      { id: "in", name: "นิ้ว (inch)", factor: 0.0254 },
      { id: "ft", name: "ฟุต (ft)", factor: 0.3048 },
      { id: "yd", name: "หลา (yard)", factor: 0.9144 },
      { id: "mi", name: "ไมล์ (mile)", factor: 1609.344 },
    ],
  },
  weight: {
    label: "น้ำหนัก",
    units: [
      { id: "mg", name: "มิลลิกรัม (mg)", factor: 0.001 },
      { id: "g", name: "กรัม (g)", factor: 1 },
      { id: "kg", name: "กิโลกรัม (kg)", factor: 1000 },
      { id: "t", name: "ตัน (ton)", factor: 1_000_000 },
      { id: "oz", name: "ออนซ์ (oz)", factor: 28.349523125 },
      { id: "lb", name: "ปอนด์ (lb)", factor: 453.59237 },
    ],
  },
};

const tempUnits = [
  { id: "C", name: "เซลเซียส (°C)" },
  { id: "F", name: "ฟาเรนไฮต์ (°F)" },
  { id: "K", name: "เคลวิน (K)" },
];

function convertTemp(value: number, from: string, to: string): number {
  let c = value;
  if (from === "F") c = (value - 32) * (5 / 9);
  else if (from === "K") c = value - 273.15;
  if (to === "F") return c * (9 / 5) + 32;
  if (to === "K") return c + 273.15;
  return c;
}

function format(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return parseFloat(n.toFixed(6)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

export function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");

  const units =
    category === "temperature"
      ? tempUnits
      : linearCategories[category].units;

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) return null;
    if (category === "temperature") return convertTemp(v, from, to);
    const cat = linearCategories[category];
    const f = cat.units.find((u) => u.id === from)?.factor ?? 1;
    const t = cat.units.find((u) => u.id === to)?.factor ?? 1;
    return (v * f) / t;
  }, [value, from, to, category]);

  function changeCategory(next: CategoryKey) {
    setCategory(next);
    const nextUnits = next === "temperature" ? tempUnits : linearCategories[next].units;
    setFrom(nextUnits[0].id);
    setTo(nextUnits[1].id);
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const categoryTabs: { key: CategoryKey; label: string }[] = [
    { key: "length", label: "ความยาว" },
    { key: "weight", label: "น้ำหนัก" },
    { key: "temperature", label: "อุณหภูมิ" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="ประเภทหน่วย"
        value={category}
        onChange={(v) => changeCategory(v as CategoryKey)}
        options={categoryTabs.map((c) => ({ value: c.key, label: c.label }))}
      />

      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">จาก</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            placeholder="0"
            aria-label="ค่าที่ต้องการแปลง"
          />
          <AppSelect
            aria-label="หน่วยต้นทาง"
            value={from}
            onChange={setFrom}
            options={units.map((u) => ({ value: u.id, label: u.name }))}
          />
        </div>

        <Button
          isIconOnly
          variant="secondary"
          onPress={swap}
          aria-label="สลับหน่วย"
          className="mb-0.5 shrink-0"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">เป็น</Label>
          <div className="flex min-h-10 items-center overflow-x-auto rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm font-semibold tabular-nums">
            {result === null ? <span className="text-muted">—</span> : format(result)}
          </div>
          <AppSelect
            aria-label="หน่วยปลายทาง"
            value={to}
            onChange={setTo}
            options={units.map((u) => ({ value: u.id, label: u.name }))}
          />
        </div>
      </div>

      {result !== null && !Number.isNaN(parseFloat(value)) && (
        <p className="text-center text-sm text-muted">
          {format(parseFloat(value))} {units.find((u) => u.id === from)?.name.split(" ")[0]} ={" "}
          <span className="font-semibold text-foreground">{format(result)}</span>{" "}
          {units.find((u) => u.id === to)?.name.split(" ")[0]}
        </p>
      )}
    </div>
  );
}

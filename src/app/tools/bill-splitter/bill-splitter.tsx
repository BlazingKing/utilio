"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Input, Button, Card, Label } from "@heroui/react";
import { AppSelect } from "@/components/ui/select";

type Mode = "equal" | "amount" | "percent";

interface Person {
  id: number;
  name: string;
  mode: Mode;
  value: string;
}

let nextId = 100;

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) ? 0 : n;
}

function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const MODE_OPTIONS = [
  { value: "equal", label: "หารเท่า" },
  { value: "amount", label: "จำนวนเงิน" },
  { value: "percent", label: "เปอร์เซ็นต์" },
];

export function BillSplitter() {
  const [total, setTotal] = useState("1200");
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "เอ", mode: "amount", value: "500" },
    { id: 2, name: "บี", mode: "percent", value: "10" },
    { id: 3, name: "ซี", mode: "equal", value: "" },
    { id: 4, name: "ดี", mode: "equal", value: "" },
  ]);

  const result = useMemo(() => {
    const totalNum = num(total);
    const fixedSum = people.reduce((s, p) => {
      if (p.mode === "amount") return s + num(p.value);
      if (p.mode === "percent") return s + (totalNum * num(p.value)) / 100;
      return s;
    }, 0);
    const equalPeople = people.filter((p) => p.mode === "equal");
    const remainder = totalNum - fixedSum;
    const perEqual = equalPeople.length > 0 ? remainder / equalPeople.length : 0;

    const shares = people.map((p) => {
      let amount = 0;
      if (p.mode === "amount") amount = num(p.value);
      else if (p.mode === "percent") amount = (totalNum * num(p.value)) / 100;
      else amount = perEqual;
      return { ...p, amount };
    });
    const collected = shares.reduce((s, p) => s + p.amount, 0);

    let warning: string | null = null;
    if (remainder < -0.005) {
      warning = `ยอดที่กำหนดไว้ (${money(fixedSum)}) เกินยอดรวม`;
    } else if (equalPeople.length === 0 && Math.abs(remainder) > 0.005) {
      warning =
        remainder > 0
          ? `ยังขาดอีก ${money(remainder)} บาท (ไม่มีคนหารเท่า)`
          : `เกินมา ${money(-remainder)} บาท`;
    }

    return { totalNum, fixedSum, remainder, perEqual, shares, collected, warning };
  }, [total, people]);

  function updatePerson(id: number, patch: Partial<Person>) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function addPerson() {
    setPeople((prev) => [...prev, { id: nextId++, name: "", mode: "equal", value: "" }]);
  }
  function removePerson(id: number) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bs-total" className="text-sm font-medium">
          ยอดรวมทั้งหมด (บาท)
        </Label>
        <Input
          id="bs-total"
          type="text"
          inputMode="decimal"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="เช่น 1200"
          fullWidth
          className="text-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">รายชื่อ ({people.length} คน)</span>
          <Button variant="secondary" size="sm" onPress={addPerson}>
            <Plus className="h-4 w-4" /> เพิ่มคน
          </Button>
        </div>

        {people.map((p) => {
          const share = result.shares.find((s) => s.id === p.id);
          return (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-2 p-2.5"
            >
              <Input
                type="text"
                value={p.name}
                onChange={(e) => updatePerson(p.id, { name: e.target.value })}
                placeholder="ชื่อ"
                aria-label="ชื่อ"
                className="w-28 flex-1"
              />
              <AppSelect
                aria-label="วิธีหาร"
                className="w-32"
                value={p.mode}
                onChange={(v) => updatePerson(p.id, { mode: v as Mode })}
                options={MODE_OPTIONS}
              />
              {p.mode !== "equal" && (
                <Input
                  type="text"
                  inputMode="decimal"
                  value={p.value}
                  onChange={(e) => updatePerson(p.id, { value: e.target.value })}
                  placeholder={p.mode === "percent" ? "%" : "บาท"}
                  aria-label={p.mode === "percent" ? "เปอร์เซ็นต์" : "จำนวนเงิน"}
                  className="w-20"
                />
              )}
              <span className="ml-auto w-24 text-right font-semibold tabular-nums text-brand">
                {money(share?.amount ?? 0)}
              </span>
              <Button
                isIconOnly
                variant="tertiary"
                size="sm"
                aria-label="ลบ"
                onPress={() => removePerson(p.id)}
                isDisabled={people.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {result.warning && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          ⚠️ {result.warning}
        </div>
      )}

      <Card className="p-4 text-sm">
        <Row label="ยอดที่กำหนดไว้ (จำนวนเงิน + เปอร์เซ็นต์)" value={money(result.fixedSum)} />
        <Row label="ยอดที่เหลือหารเท่ากัน" value={money(Math.max(0, result.remainder))} />
        <Row
          label={`คนละ (สำหรับคนหารเท่า)`}
          value={money(result.perEqual > 0 ? result.perEqual : 0)}
        />
        <div className="mt-2 border-t border-border pt-2">
          <Row label="รวมที่เก็บได้" value={money(result.collected)} strong />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className={strong ? "font-semibold text-foreground" : "text-muted"}>{label}</span>
      <span className={`tabular-nums ${strong ? "font-semibold" : ""}`}>{value} บาท</span>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Input, Button, Card, Switch, Label } from "@heroui/react";
import { AppSelect } from "@/components/ui/select";

type FixedMode = "none" | "amount" | "percent";

interface Person {
  id: number;
  name: string;
  fixedMode: FixedMode;
  fixedValue: string;
  joinEqual: boolean;
}

let nextId = 100;

function num(v: string): number {
  const n = Number(v.replace(/[,\s]/g, ""));
  return isNaN(n) ? 0 : n;
}

function money(n: number): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const FIXED_OPTIONS = [
  { value: "none", label: "ไม่มี" },
  { value: "amount", label: "จำนวนเงิน" },
  { value: "percent", label: "เปอร์เซ็นต์" },
];

export function BillSplitter() {
  const [total, setTotal] = useState("1200");
  const [service, setService] = useState("0");
  const [vat, setVat] = useState("7");
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "ดี", fixedMode: "amount", fixedValue: "500", joinEqual: true },
    { id: 2, name: "เอ", fixedMode: "none", fixedValue: "", joinEqual: true },
    { id: 3, name: "บี", fixedMode: "none", fixedValue: "", joinEqual: true },
    { id: 4, name: "ซี", fixedMode: "percent", fixedValue: "10", joinEqual: false },
  ]);

  const result = useMemo(() => {
    const totalNum = num(total);
    const serviceRate = num(service) / 100;
    const vatRate = num(vat) / 100;
    const mult = (1 + serviceRate) * (1 + vatRate);

    const fixedOf = (p: Person) => {
      if (p.fixedMode === "amount") return num(p.fixedValue);
      if (p.fixedMode === "percent") return (totalNum * num(p.fixedValue)) / 100;
      return 0;
    };
    const fixedSum = people.reduce((s, p) => s + fixedOf(p), 0);
    const equalCount = people.filter((p) => p.joinEqual).length;
    const remainder = totalNum - fixedSum;
    const perEqual = equalCount > 0 ? remainder / equalCount : 0;

    const shares = people.map((p) => {
      const fixed = fixedOf(p);
      const equal = p.joinEqual ? perEqual : 0;
      const subtotal = fixed + equal;
      return { ...p, fixed, equal, subtotal, final: subtotal * mult };
    });
    const collected = shares.reduce((s, p) => s + p.subtotal, 0);
    const serviceAmt = collected * serviceRate;
    const vatAmt = (collected + serviceAmt) * vatRate;
    const grand = collected * mult;
    const hasSurcharge = serviceRate > 0 || vatRate > 0;

    let warning: string | null = null;
    if (remainder < -0.005) {
      warning = `ยอดที่กำหนดไว้ (${money(fixedSum)}) เกินยอดรวม`;
    } else if (equalCount === 0 && Math.abs(remainder) > 0.005) {
      warning =
        remainder > 0
          ? `ยังขาดอีก ${money(remainder)} บาท — ยังไม่มีใครร่วมหารเท่า`
          : `เกินมา ${money(-remainder)} บาท`;
    }

    return {
      totalNum, fixedSum, remainder, perEqual, equalCount,
      shares, collected, serviceAmt, vatAmt, grand, hasSurcharge, warning,
    };
  }, [total, service, vat, people]);

  function updatePerson(id: number, patch: Partial<Person>) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function addPerson() {
    setPeople((prev) => [...prev, { id: nextId++, name: "", fixedMode: "none", fixedValue: "", joinEqual: true }]);
  }
  function removePerson(id: number) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bs-total" className="text-sm font-medium">
            ยอดรวมก่อน VAT (บาท)
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bs-service" className="text-sm font-medium">
            ค่าบริการ %
          </Label>
          <Input
            id="bs-service"
            type="text"
            inputMode="decimal"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-24"
            aria-label="ค่าบริการเปอร์เซ็นต์"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bs-vat" className="text-sm font-medium">
            VAT %
          </Label>
          <Input
            id="bs-vat"
            type="text"
            inputMode="decimal"
            value={vat}
            onChange={(e) => setVat(e.target.value)}
            className="w-24"
            aria-label="VAT เปอร์เซ็นต์"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">รายชื่อ ({people.length} คน)</span>
          <Button variant="secondary" size="sm" onPress={addPerson}>
            <Plus className="h-4 w-4" /> เพิ่มคน
          </Button>
        </div>

        {result.shares.map((p) => (
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
              aria-label="ส่วนที่จ่ายเอง"
              className="w-32"
              value={p.fixedMode}
              onChange={(v) => updatePerson(p.id, { fixedMode: v as FixedMode })}
              options={FIXED_OPTIONS}
            />
            {p.fixedMode !== "none" && (
              <Input
                type="text"
                inputMode="decimal"
                value={p.fixedValue}
                onChange={(e) => updatePerson(p.id, { fixedValue: e.target.value })}
                placeholder={p.fixedMode === "percent" ? "%" : "บาท"}
                aria-label={p.fixedMode === "percent" ? "เปอร์เซ็นต์" : "จำนวนเงิน"}
                className="w-20"
              />
            )}
            <Switch
              isSelected={p.joinEqual}
              onChange={(v) => updatePerson(p.id, { joinEqual: v })}
              aria-label="ร่วมหารเท่า"
            >
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <span className="text-sm">ร่วมหาร</span>
              </Switch.Content>
            </Switch>
            <span className="ml-auto w-24 text-right font-semibold tabular-nums text-brand">
              {money(p.final)}
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
        ))}
      </div>

      {result.warning && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          ⚠️ {result.warning}
        </div>
      )}

      {/* สรุปต่อคน (ชื่อ + แยกส่วน + ยอดสุทธิรวม VAT) */}
      <Card className="p-4">
        <p className="mb-2 text-sm font-semibold text-muted">
          สรุปต่อคน {result.hasSurcharge && <span className="font-normal">(ยอดสุทธิรวมค่าบริการ/VAT แล้ว)</span>}
        </p>
        <div className="flex flex-col gap-1.5 text-sm">
          {result.shares.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <span className="font-medium">{p.name.trim() || "(ไม่มีชื่อ)"}</span>
              <span className="flex flex-wrap items-center justify-end gap-1.5 text-right tabular-nums">
                {p.fixed > 0 && <span className="text-muted">จ่ายเอง {money(p.fixed)}</span>}
                {p.fixed > 0 && p.equal > 0 && <span className="text-muted">+</span>}
                {p.equal > 0 && <span className="text-muted">หารเท่า {money(p.equal)}</span>}
                {result.hasSurcharge && (p.fixed > 0 || p.equal > 0) && (
                  <span className="text-muted">→ ก่อน VAT {money(p.subtotal)}</span>
                )}
                <span className="text-muted">=</span>
                <span className="font-semibold text-brand">{money(p.final)}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ภาพรวม */}
      <Card className="p-4 text-sm">
        <Row label="ยอดที่จ่ายเอง (จำนวนเงิน + เปอร์เซ็นต์)" value={money(result.fixedSum)} />
        <Row label="ยอดที่เหลือหารเท่ากัน" value={money(Math.max(0, result.remainder))} />
        <Row label={`คนละ (${result.equalCount} คนที่ร่วมหาร, ก่อน VAT)`} value={money(result.perEqual > 0 ? result.perEqual : 0)} />
        <div className="mt-2 border-t border-border pt-2">
          <Row label="ยอดรวมก่อน VAT" value={money(result.collected)} />
          {result.serviceAmt > 0 && <Row label={`ค่าบริการ (${num(service)}%)`} value={money(result.serviceAmt)} />}
          {result.vatAmt > 0 && <Row label={`VAT (${num(vat)}%)`} value={money(result.vatAmt)} />}
          <Row label="รวมสุทธิที่ต้องจ่าย" value={money(result.grand)} strong />
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

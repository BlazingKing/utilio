"use client";

import { useState } from "react";
import { Dices, Shuffle } from "lucide-react";
import { Input, Button, TextArea, Card, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";

type Mode = "list" | "number";

/** สุ่มจำนวนเต็ม [min, max] แบบปลอดภัยด้วย Web Crypto */
function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const limit = Math.floor(0xffffffff / range) * range;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return min + (x % range);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function RandomPicker() {
  const [mode, setMode] = useState<Mode>("list");

  // โหมดรายการ
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [shuffled, setShuffled] = useState<string[] | null>(null);
  const items = text.split("\n").map((s) => s.trim()).filter(Boolean);

  // โหมดตัวเลข
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [number, setNumber] = useState<number | null>(null);

  function pickOne() {
    if (items.length === 0) return;
    setShuffled(null);
    setPicked(items[randomInt(0, items.length - 1)]);
  }
  function doShuffle() {
    if (items.length === 0) return;
    setPicked(null);
    setShuffled(shuffle(items));
  }
  function rollNumber() {
    const lo = Math.floor(Number(min));
    const hi = Math.floor(Number(max));
    if (isNaN(lo) || isNaN(hi) || lo > hi) return;
    setNumber(randomInt(lo, hi));
  }

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        className="self-start"
        aria-label="โหมดสุ่ม"
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "list", label: "สุ่มจากรายการ" },
          { value: "number", label: "สุ่มตัวเลข" },
        ]}
      />

      {mode === "list" ? (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rp-list" className="text-sm font-medium">
              รายการ (บรรทัดละ 1 รายการ) — {items.length} รายการ
            </Label>
            <TextArea
              id="rp-list"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"สมชาย\nสมหญิง\nสมศักดิ์"}
              rows={6}
              fullWidth
              className="resize-y"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onPress={pickOne} isDisabled={items.length === 0}>
              <Dices className="h-4 w-4" /> สุ่มเลือก 1 รายการ
            </Button>
            <Button variant="secondary" onPress={doShuffle} isDisabled={items.length === 0}>
              <Shuffle className="h-4 w-4" /> สับลำดับทั้งหมด
            </Button>
          </div>

          {picked && (
            <Card className="flex flex-col items-center gap-1 bg-brand-soft p-6 text-center text-brand">
              <p className="text-sm">ผลการสุ่ม</p>
              <p className="text-2xl font-bold">{picked}</p>
            </Card>
          )}

          {shuffled && (
            <Card className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted">ลำดับที่สับใหม่</span>
                <CopyButton value={shuffled.join("\n")} label="คัดลอกทั้งหมด" />
              </div>
              <ol className="list-decimal space-y-0.5 pl-6 text-sm">
                {shuffled.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </Card>
          )}
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rp-min" className="text-sm font-medium">
                ค่าต่ำสุด
              </Label>
              <Input
                id="rp-min"
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                fullWidth
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rp-max" className="text-sm font-medium">
                ค่าสูงสุด
              </Label>
              <Input
                id="rp-max"
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <Button variant="primary" className="self-start" onPress={rollNumber}>
            <Dices className="h-4 w-4" /> สุ่มตัวเลข
          </Button>

          {number !== null && (
            <Card className="flex flex-col items-center gap-1 bg-brand-soft p-8 text-center text-brand">
              <p className="text-sm">ผลการสุ่ม</p>
              <p className="text-5xl font-bold tabular-nums">{number}</p>
            </Card>
          )}
        </>
      )}

      <p className="text-xs text-muted">สุ่มด้วย Web Crypto API — ยุติธรรมและทำงานในเบราว์เซอร์</p>
    </div>
  );
}

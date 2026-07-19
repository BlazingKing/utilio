"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Input, Button, Switch, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";

function makeUuids(n: number): string[] {
  return Array.from({ length: Math.min(Math.max(n, 1), 100) }, () => crypto.randomUUID());
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [raw, setRaw] = useState<string[]>(() => makeUuids(5));

  const uuids = uppercase ? raw.map((u) => u.toUpperCase()) : raw;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="uuid-count" className="text-sm font-medium">
            จำนวน
          </Label>
          <Input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={String(count)}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <Switch isSelected={uppercase} onChange={setUppercase} className="py-2">
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            ตัวพิมพ์ใหญ่
          </Switch.Content>
        </Switch>
        <Button variant="primary" className="ml-auto" onPress={() => setRaw(makeUuids(count))}>
          <RefreshCw className="h-4 w-4" /> สร้างใหม่
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{uuids.length} รายการ (UUID v4)</span>
        <CopyButton value={uuids.join("\n")} label="คัดลอกทั้งหมด" />
      </div>

      <div className="flex flex-col gap-2">
        {uuids.map((u, i) => (
          <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2">
            <code className="truncate font-mono text-sm">{u}</code>
            <CopyButton value={u} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Switch, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { AppSlider } from "@/components/ui/slider";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  symbol: "!@#$%^&*()-_=+[]{};:,.<>?",
};

type SetKey = keyof typeof SETS;

/** สุ่มดัชนีแบบปลอดภัยด้วย Web Crypto (หลีกเลี่ยง modulo bias) */
function randomInt(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

function generate(length: number, sets: Record<SetKey, boolean>): string {
  const active = (Object.keys(SETS) as SetKey[]).filter((k) => sets[k]);
  if (active.length === 0) return "";
  const pool = active.map((k) => SETS[k]).join("");
  const chars: string[] = [];
  // รับประกันว่ามีอักขระจากทุกชุดที่เลือกอย่างน้อยชุดละ 1 ตัว
  active.forEach((k) => chars.push(SETS[k][randomInt(SETS[k].length)]));
  for (let i = chars.length; i < length; i++) {
    chars.push(pool[randomInt(pool.length)]);
  }
  // สับตำแหน่ง (Fisher–Yates)
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, length).join("");
}

function strength(pw: string, poolSize: number): { label: string; level: number } {
  if (!pw) return { label: "—", level: 0 };
  const bits = pw.length * Math.log2(poolSize || 1);
  if (bits < 40) return { label: "อ่อน", level: 1 };
  if (bits < 60) return { label: "พอใช้", level: 2 };
  if (bits < 90) return { label: "แข็งแรง", level: 3 };
  return { label: "แข็งแรงมาก", level: 4 };
}

const LEVEL_COLORS = ["bg-border", "bg-red-500", "bg-amber-500", "bg-green-500", "bg-emerald-500"];

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [sets, setSets] = useState<Record<SetKey, boolean>>({
    lower: true,
    upper: true,
    number: true,
    symbol: true,
  });
  const [password, setPassword] = useState("");

  const regenerate = useCallback(() => {
    setPassword(generate(length, sets));
  }, [length, sets]);

  // สร้างใหม่ทุกครั้งที่เปลี่ยนความยาว/ชุดอักขระ
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const poolSize = (Object.keys(SETS) as SetKey[])
    .filter((k) => sets[k])
    .reduce((sum, k) => sum + SETS[k].length, 0);
  const s = strength(password, poolSize);

  const toggle = (k: SetKey) => setSets((prev) => ({ ...prev, [k]: !prev[k] }));
  const noneSelected = !Object.values(sets).some(Boolean);

  const options: { key: SetKey; label: string }[] = [
    { key: "lower", label: "ตัวพิมพ์เล็ก (a-z)" },
    { key: "upper", label: "ตัวพิมพ์ใหญ่ (A-Z)" },
    { key: "number", label: "ตัวเลข (0-9)" },
    { key: "symbol", label: "สัญลักษณ์ (!@#$)" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* รหัสผ่านที่สร้าง */}
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <code className="min-h-7 break-all font-mono text-lg">
            {password || <span className="text-muted">เลือกอย่างน้อยหนึ่งชุดอักขระ</span>}
          </code>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              isIconOnly
              variant="tertiary"
              size="sm"
              aria-label="สร้างใหม่"
              onPress={regenerate}
              isDisabled={noneSelected}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <CopyButton value={password} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= s.level ? LEVEL_COLORS[s.level] : "bg-border"}`}
              />
            ))}
          </div>
          <span className="w-24 text-right text-xs text-muted">ความแข็งแรง: {s.label}</span>
        </div>
      </div>

      {/* ความยาว */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">ความยาว: {length} ตัวอักษร</Label>
        <AppSlider
          aria-label="ความยาวรหัสผ่าน"
          value={length}
          onChange={setLength}
          minValue={6}
          maxValue={64}
          step={1}
        />
      </div>

      {/* ชุดอักขระ */}
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <Switch key={o.key} isSelected={sets[o.key]} onChange={() => toggle(o.key)}>
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              {o.label}
            </Switch.Content>
          </Switch>
        ))}
      </div>

      <p className="text-xs text-muted">
        สุ่มด้วย Web Crypto API ในเบราว์เซอร์ รหัสผ่านไม่ถูกส่งออกจากเครื่องคุณ
      </p>
    </div>
  );
}

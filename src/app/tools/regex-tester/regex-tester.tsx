"use client";

import { Fragment, useMemo, useState } from "react";
import { Input, TextArea, Switch, Label } from "@heroui/react";

type Flag = "g" | "i" | "m" | "s";
const FLAGS: { key: Flag; label: string }[] = [
  { key: "g", label: "g — ทั้งหมด" },
  { key: "i", label: "i — ไม่สนตัวพิมพ์" },
  { key: "m", label: "m — หลายบรรทัด" },
  { key: "s", label: "s — . รวม \\n" },
];

interface Seg {
  text: string;
  match: boolean;
}

export function RegexTester() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+\\.\\w+)");
  const [flags, setFlags] = useState<Record<Flag, boolean>>({ g: true, i: false, m: false, s: false });
  const [text, setText] = useState("ติดต่อ somchai@example.com หรือ admin@utilio.dev ได้เลย");

  const flagStr = (Object.keys(flags) as Flag[]).filter((f) => flags[f]).join("");

  const { error, matches, segments } = useMemo(() => {
    if (!pattern) return { error: null as string | null, matches: [] as RegExpMatchArray[], segments: [{ text, match: false }] as Seg[] };
    let re: RegExp;
    try {
      re = new RegExp(pattern, flagStr);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "รูปแบบไม่ถูกต้อง", matches: [], segments: [{ text, match: false }] };
    }
    const found: RegExpMatchArray[] = [];
    if (flags.g) {
      for (const m of text.matchAll(re)) found.push(m);
    } else {
      const m = re.exec(text);
      if (m) found.push(m);
    }
    // สร้าง segment สำหรับไฮไลต์
    const segs: Seg[] = [];
    let last = 0;
    for (const m of found) {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      if (m[0].length === 0) continue;
      if (start > last) segs.push({ text: text.slice(last, start), match: false });
      segs.push({ text: text.slice(start, end), match: true });
      last = end;
    }
    if (last < text.length) segs.push({ text: text.slice(last), match: false });
    return { error: null, matches: found, segments: segs.length ? segs : [{ text, match: false }] };
  }, [pattern, flagStr, flags.g, text]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rx-pat" className="text-sm font-medium">
          Regular Expression
        </Label>
        <Input
          id="rx-pat"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="เช่น \d{3}-\d{4}"
          fullWidth
          className="font-mono"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {FLAGS.map((f) => (
          <Switch
            key={f.key}
            isSelected={flags[f.key]}
            onChange={(v) => setFlags((prev) => ({ ...prev, [f.key]: v }))}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <span className="text-sm">{f.label}</span>
            </Switch.Content>
          </Switch>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rx-text" className="text-sm font-medium">
          ข้อความทดสอบ
        </Label>
        <TextArea
          id="rx-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          fullWidth
          className="resize-y font-mono"
          spellCheck={false}
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 font-mono text-sm whitespace-pre-wrap break-words">
            {segments.map((s, i) => (
              <Fragment key={i}>
                {s.match ? (
                  <mark className="rounded bg-brand/30 text-foreground">{s.text}</mark>
                ) : (
                  s.text
                )}
              </Fragment>
            ))}
          </div>

          <p className="text-sm text-muted">พบ {matches.length} รายการที่ตรง</p>

          {matches.length > 0 && (
            <div className="flex flex-col gap-2">
              {matches.slice(0, 20).map((m, i) => (
                <div key={i} className="rounded-lg bg-surface-2 px-3 py-2 text-sm">
                  <code className="font-mono text-brand">{m[0]}</code>
                  {m.length > 1 && (
                    <span className="ml-2 text-xs text-muted">
                      กลุ่ม: {m.slice(1).map((g, gi) => `$${gi + 1}=${g ?? "∅"}`).join("  ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

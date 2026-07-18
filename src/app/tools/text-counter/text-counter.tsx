"use client";

import { useMemo, useState } from "react";

export function TextCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = [...text].length;
    const charsNoSpace = [...text.replace(/\s/g, "")].length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = (text.match(/[^.!?。！？]+[.!?。！？]+/g) || []).length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const paragraphs = text.trim()
      ? text.trim().split(/\n\s*\n/).filter(Boolean).length
      : 0;
    const readingSec = Math.ceil((words / 200) * 60); // ~200 คำ/นาที
    return { chars, charsNoSpace, words, sentences, lines, paragraphs, readingSec };
  }, [text]);

  const cards: { label: string; value: string | number }[] = [
    { label: "ตัวอักษร", value: stats.chars },
    { label: "ตัวอักษร (ไม่นับเว้นวรรค)", value: stats.charsNoSpace },
    { label: "คำ", value: stats.words },
    { label: "ประโยค", value: stats.sentences },
    { label: "บรรทัด", value: stats.lines },
    { label: "ย่อหน้า", value: stats.paragraphs },
  ];

  const readingLabel =
    stats.readingSec < 60
      ? `${stats.readingSec} วินาที`
      : `${Math.floor(stats.readingSec / 60)} นาที ${stats.readingSec % 60} วินาที`;

  return (
    <div className="flex flex-col gap-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="พิมพ์หรือวางข้อความเพื่อดูสถิติแบบเรียลไทม์..."
        rows={8}
        className="field resize-y"
        aria-label="ข้อความสำหรับนับ"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card p-4 text-center">
            <div className="text-2xl font-bold tabular-nums text-brand">
              {c.value.toLocaleString()}
            </div>
            <div className="mt-0.5 text-xs text-muted">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card px-4 py-3 text-center text-sm text-muted">
        เวลาอ่านโดยประมาณ:{" "}
        <span className="font-semibold text-foreground">{readingLabel}</span>
      </div>
    </div>
  );
}

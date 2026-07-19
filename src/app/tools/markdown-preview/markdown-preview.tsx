"use client";

import { useMemo, useState } from "react";
import { TextArea, Label } from "@heroui/react";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** จัดรูปแบบ inline: code, bold, italic, link (escape ไว้ก่อนแล้ว จึงปลอดภัยจาก XSS) */
function inline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-2 px-1 py-0.5 font-mono text-sm">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, u) => {
      const safe = /^(https?:|mailto:)/i.test(u) ? u : "#";
      return `<a href="${safe}" target="_blank" rel="noopener noreferrer nofollow" class="text-brand hover:underline">${t}</a>`;
    });
}

function toHtml(md: string): string {
  const lines = escapeHtml(md).split("\n");
  const out: string[] = [];
  let i = 0;
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // code fence
    if (/^```/.test(line.trim())) {
      closeList();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) buf.push(lines[i++]);
      i++;
      out.push(`<pre class="overflow-x-auto rounded-lg bg-surface-2 p-3"><code class="font-mono text-sm">${buf.join("\n")}</code></pre>`);
      continue;
    }

    // heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      const level = h[1].length;
      const sizes = ["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-sm"];
      out.push(`<h${level} class="mt-3 mb-1 font-bold ${sizes[level - 1]}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // hr
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      closeList();
      out.push('<hr class="my-3 border-border" />');
      i++;
      continue;
    }

    // blockquote (> ถูก escape เป็น &gt; แล้ว)
    if (/^&gt;\s?/.test(line)) {
      closeList();
      out.push(`<blockquote class="border-l-4 border-border pl-3 text-muted italic">${inline(line.replace(/^&gt;\s?/, ""))}</blockquote>`);
      i++;
      continue;
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      if (listType !== "ul") {
        closeList();
        out.push('<ul class="ml-5 list-disc">');
        listType = "ul";
      }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      if (listType !== "ol") {
        closeList();
        out.push('<ol class="ml-5 list-decimal">');
        listType = "ol";
      }
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // blank
    if (line.trim() === "") {
      closeList();
      i++;
      continue;
    }

    // paragraph
    closeList();
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }
  closeList();
  return out.join("\n");
}

const SAMPLE = `# หัวข้อใหญ่

ข้อความ **ตัวหนา** และ *ตัวเอียง* พร้อม \`inline code\`

- รายการที่ 1
- รายการที่ 2

> คำพูดอ้างอิง

[ไปที่ Google](https://www.google.com/)`;

export function MarkdownPreview() {
  const [md, setMd] = useState(SAMPLE);
  const html = useMemo(() => toHtml(md), [md]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="md-in" className="text-sm font-medium">
            Markdown
          </Label>
          <TextArea
            id="md-in"
            value={md}
            onChange={(e) => setMd(e.target.value)}
            rows={16}
            fullWidth
            className="resize-y font-mono"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">พรีวิว</span>
          <div
            className="min-h-40 space-y-2 overflow-x-auto rounded-xl border border-border bg-surface px-4 py-3 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <p className="text-xs text-muted">
        รองรับหัวข้อ, ตัวหนา/เอียง, โค้ด, ลิสต์, blockquote, เส้นคั่น และลิงก์ — HTML ดิบถูก escape เพื่อความปลอดภัย
      </p>
    </div>
  );
}

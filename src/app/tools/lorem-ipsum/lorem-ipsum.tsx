"use client";

import { useMemo, useState } from "react";
import { TextArea, Input, Label } from "@heroui/react";
import { CopyButton } from "@/components/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { AppSelect } from "@/components/ui/select";

type Lang = "latin" | "thai";
type Unit = "paragraphs" | "sentences" | "words";

const LATIN =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum".split(" ");

const THAI =
  "การ ทำงาน ระบบ ข้อมูล ผู้ใช้ บริการ พัฒนา ความ สะดวก รวดเร็ว ปลอดภัย เครื่องมือ ทดสอบ ตัวอย่าง ข้อความ ภาษา ไทย สำหรับ การออกแบบ หน้าเว็บ และ แอปพลิเคชัน ที่ ทันสมัย ใช้งาน ง่าย มี ประสิทธิภาพ".split(" ");

function rand(max: number) {
  return Math.floor(Math.random() * max);
}
function pick(pool: string[]) {
  return pool[rand(pool.length)];
}
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function makeWords(pool: string[], n: number): string {
  return Array.from({ length: n }, () => pick(pool)).join(" ");
}

function makeSentence(pool: string[], latin: boolean): string {
  const n = 6 + rand(9);
  const s = makeWords(pool, n);
  return latin ? cap(s) + "." : s;
}

function makeParagraph(pool: string[], latin: boolean): string {
  const n = 3 + rand(4);
  return Array.from({ length: n }, () => makeSentence(pool, latin)).join(latin ? " " : " ");
}

export function LoremIpsum() {
  const [lang, setLang] = useState<Lang>("latin");
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState("3");
  const [seed, setSeed] = useState(0); // สำหรับกดสร้างใหม่

  const output = useMemo(() => {
    const pool = lang === "latin" ? LATIN : THAI;
    const latin = lang === "latin";
    const n = Math.min(Math.max(Math.floor(Number(count)) || 0, 1), 100);
    void seed;
    if (unit === "words") return cap(makeWords(pool, n)) + (latin ? "." : "");
    if (unit === "sentences") {
      return Array.from({ length: n }, () => makeSentence(pool, latin)).join(" ");
    }
    const paras = Array.from({ length: n }, () => makeParagraph(pool, latin));
    if (latin) paras[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paras[0];
    return paras.join("\n\n");
  }, [lang, unit, count, seed]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end gap-4">
        <SegmentedControl
          aria-label="ภาษา"
          value={lang}
          onChange={(v) => setLang(v as Lang)}
          options={[
            { value: "latin", label: "Latin" },
            { value: "thai", label: "ไทย" },
          ]}
        />
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium">หน่วย</Label>
          <AppSelect
            aria-label="หน่วย"
            className="w-36"
            value={unit}
            onChange={(v) => setUnit(v as Unit)}
            options={[
              { value: "paragraphs", label: "ย่อหน้า" },
              { value: "sentences", label: "ประโยค" },
              { value: "words", label: "คำ" },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="li-count" className="text-sm font-medium">
            จำนวน
          </Label>
          <Input
            id="li-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-24"
          />
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="text-sm text-brand hover:underline"
        >
          สร้างใหม่
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="li-out" className="text-sm font-medium">
            ผลลัพธ์
          </Label>
          <CopyButton value={output} />
        </div>
        <TextArea
          id="li-out"
          value={output}
          readOnly
          rows={10}
          fullWidth
          className="resize-y"
        />
      </div>
    </div>
  );
}

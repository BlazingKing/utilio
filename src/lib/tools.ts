import {
  Type,
  Calculator,
  CaseSensitive,
  Baseline,
  Braces,
  Binary,
  Ruler,
  Percent,
  type LucideIcon,
} from "lucide-react";

/** หมวดหมู่ของเครื่องมือ — เพิ่มหมวดใหม่ได้ที่นี่ */
export type CategoryId = "text" | "calc";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface Tool {
  /** ใช้เป็น URL: /tools/<slug> */
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: LucideIcon;
  /** คำค้นเพิ่มเติมสำหรับช่องค้นหา (ไทย/อังกฤษ) */
  keywords: string[];
}

export const categories: Category[] = [
  {
    id: "text",
    name: "แปลง & จัดข้อความ",
    description: "แปลงรูปแบบข้อความ นับ จัดระเบียบ และเข้ารหัส",
    icon: Type,
  },
  {
    id: "calc",
    name: "คำนวณ & แปลงหน่วย",
    description: "คิดเลข แปลงหน่วย และเครื่องมือคำนวณต่าง ๆ",
    icon: Calculator,
  },
];

/**
 * รายการเครื่องมือทั้งหมด — เพิ่มเครื่องมือใหม่โดยเพิ่ม object ที่นี่
 * แล้วสร้างหน้า src/app/tools/<slug>/page.tsx
 */
export const tools: Tool[] = [
  {
    slug: "case-converter",
    name: "แปลงตัวพิมพ์",
    description: "แปลงข้อความเป็น UPPERCASE, lowercase, Title Case, camelCase, snake_case ฯลฯ",
    category: "text",
    icon: CaseSensitive,
    keywords: ["case", "uppercase", "lowercase", "camel", "snake", "ตัวพิมพ์ใหญ่", "ตัวพิมพ์เล็ก"],
  },
  {
    slug: "text-counter",
    name: "นับข้อความ",
    description: "นับจำนวนตัวอักษร คำ บรรทัด และย่อหน้าแบบเรียลไทม์",
    category: "text",
    icon: Baseline,
    keywords: ["count", "word", "character", "line", "นับคำ", "นับตัวอักษร"],
  },
  {
    slug: "json-formatter",
    name: "จัดรูปแบบ JSON",
    description: "จัดระเบียบ (beautify) หรือย่อ (minify) JSON พร้อมตรวจสอบความถูกต้อง",
    category: "text",
    icon: Braces,
    keywords: ["json", "format", "beautify", "minify", "validate", "จัดรูปแบบ"],
  },
  {
    slug: "base64",
    name: "Base64 Encode / Decode",
    description: "เข้ารหัสและถอดรหัสข้อความเป็น Base64 รองรับ Unicode/ภาษาไทย",
    category: "text",
    icon: Binary,
    keywords: ["base64", "encode", "decode", "เข้ารหัส", "ถอดรหัส"],
  },
  {
    slug: "unit-converter",
    name: "แปลงหน่วย",
    description: "แปลงหน่วยความยาว น้ำหนัก และอุณหภูมิ",
    category: "calc",
    icon: Ruler,
    keywords: ["unit", "convert", "length", "weight", "temperature", "แปลงหน่วย", "อุณหภูมิ"],
  },
  {
    slug: "percentage-calculator",
    name: "คำนวณเปอร์เซ็นต์",
    description: "หาเปอร์เซ็นต์ ส่วนลด และการเพิ่ม/ลดเป็นเปอร์เซ็นต์",
    category: "calc",
    icon: Percent,
    keywords: ["percent", "percentage", "discount", "เปอร์เซ็นต์", "ส่วนลด"],
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: CategoryId): Tool[] {
  return tools.filter((t) => t.category === category);
}

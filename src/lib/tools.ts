import {
  Type,
  Calculator,
  CaseSensitive,
  Baseline,
  Braces,
  Binary,
  Ruler,
  Percent,
  Flag,
  Code2,
  Palette as PaletteCat,
  Coins,
  CalendarDays,
  IdCard,
  Languages,
  Link2,
  Fingerprint,
  Hash,
  Clock,
  KeyRound,
  Palette,
  QrCode,
  ImageDown,
  type LucideIcon,
} from "lucide-react";

/** หมวดหมู่ของเครื่องมือ — เพิ่มหมวดใหม่ได้ที่นี่ */
export type CategoryId = "text" | "calc" | "thai" | "dev" | "media";

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
    id: "thai",
    name: "เครื่องมือไทย",
    description: "บาทถ้วน แปลงปี พ.ศ. ตรวจเลขบัตร และเลขไทย",
    icon: Flag,
  },
  {
    id: "text",
    name: "แปลง & จัดข้อความ",
    description: "แปลงรูปแบบข้อความ นับ จัดระเบียบ และเข้ารหัส",
    icon: Type,
  },
  {
    id: "dev",
    name: "สำหรับนักพัฒนา",
    description: "เครื่องมือช่วยงานเขียนโค้ดและดีบัก",
    icon: Code2,
  },
  {
    id: "calc",
    name: "คำนวณ & แปลงหน่วย",
    description: "คิดเลข แปลงหน่วย และเครื่องมือคำนวณต่าง ๆ",
    icon: Calculator,
  },
  {
    id: "media",
    name: "สี & รูปภาพ",
    description: "แปลงสี สร้าง QR และจัดการรูปภาพ",
    icon: PaletteCat,
  },
];

/**
 * รายการเครื่องมือทั้งหมด — เพิ่มเครื่องมือใหม่โดยเพิ่ม object ที่นี่
 * แล้วสร้างหน้า src/app/tools/<slug>/page.tsx
 */
export const tools: Tool[] = [
  // ---------- text ----------
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

  // ---------- calc ----------
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

  // ---------- thai ----------
  {
    slug: "baht-text",
    name: "จำนวนเงินเป็นตัวหนังสือ (บาทถ้วน)",
    description: "แปลงตัวเลขจำนวนเงินเป็นข้อความภาษาไทย เช่น 1,250.50 → หนึ่งพันสองร้อยห้าสิบบาทห้าสิบสตางค์",
    category: "thai",
    icon: Coins,
    keywords: ["baht", "บาทถ้วน", "เงิน", "ตัวหนังสือ", "ใบเสร็จ", "ใบกำกับภาษี", "อ่านเลข"],
  },
  {
    slug: "thai-date-converter",
    name: "แปลงปี พ.ศ. ↔ ค.ศ.",
    description: "แปลงระหว่างพุทธศักราชและคริสต์ศักราช พร้อมจัดรูปแบบวันที่แบบไทย",
    category: "thai",
    icon: CalendarDays,
    keywords: ["พ.ศ.", "ค.ศ.", "buddhist", "year", "วันที่", "ปฏิทิน", "date"],
  },
  {
    slug: "thai-id-checker",
    name: "ตรวจเลขบัตรประชาชน",
    description: "ตรวจสอบความถูกต้องของเลขบัตรประชาชนไทย 13 หลักด้วย checksum",
    category: "thai",
    icon: IdCard,
    keywords: ["บัตรประชาชน", "เลขบัตร", "id card", "citizen", "checksum", "13 หลัก"],
  },
  {
    slug: "thai-numeral",
    name: "แปลงเลขไทย ↔ อารบิก",
    description: "แปลงตัวเลขไทย (๐๑๒๓) เป็นเลขอารบิก (0123) และกลับกัน",
    category: "thai",
    icon: Languages,
    keywords: ["เลขไทย", "เลขอารบิก", "thai numeral", "๐๑๒๓", "แปลงเลข"],
  },

  // ---------- dev ----------
  {
    slug: "url-encoder",
    name: "URL Encode / Decode",
    description: "เข้ารหัสและถอดรหัส URL (percent-encoding) รองรับข้อความและ query string",
    category: "dev",
    icon: Link2,
    keywords: ["url", "uri", "encode", "decode", "percent", "query", "เข้ารหัส url"],
  },
  {
    slug: "uuid-generator",
    name: "สร้าง UUID",
    description: "สร้างรหัส UUID v4 แบบสุ่ม ทีละหลายรายการ พร้อมคัดลอกได้ทันที",
    category: "dev",
    icon: Fingerprint,
    keywords: ["uuid", "guid", "generate", "random", "รหัส", "สุ่ม"],
  },
  {
    slug: "hash-generator",
    name: "สร้าง Hash",
    description: "คำนวณค่า hash ด้วย SHA-1, SHA-256, SHA-384 และ SHA-512 จากข้อความ",
    category: "dev",
    icon: Hash,
    keywords: ["hash", "sha", "sha256", "checksum", "digest", "แฮช"],
  },
  {
    slug: "timestamp-converter",
    name: "แปลง Timestamp",
    description: "แปลง Unix timestamp เป็นวันที่ที่อ่านได้ และกลับกัน (วินาที/มิลลิวินาที)",
    category: "dev",
    icon: Clock,
    keywords: ["timestamp", "unix", "epoch", "date", "เวลา", "แปลงเวลา"],
  },
  {
    slug: "jwt-decoder",
    name: "ถอดรหัส JWT",
    description: "ถอดดู header และ payload ของ JWT (JSON Web Token) โดยไม่ตรวจสอบลายเซ็น",
    category: "dev",
    icon: KeyRound,
    keywords: ["jwt", "token", "decode", "json web token", "ถอดรหัส", "payload"],
  },

  // ---------- media ----------
  {
    slug: "color-converter",
    name: "แปลงสี",
    description: "แปลงค่าสีระหว่าง HEX, RGB และ HSL พร้อมตัวอย่างสีและเลือกสีจากจานสี",
    category: "media",
    icon: Palette,
    keywords: ["color", "hex", "rgb", "hsl", "สี", "แปลงสี", "จานสี"],
  },
  {
    slug: "qr-generator",
    name: "สร้าง QR Code",
    description: "สร้างคิวอาร์โค้ดจากข้อความหรือ URL และดาวน์โหลดเป็นรูปภาพ PNG",
    category: "media",
    icon: QrCode,
    keywords: ["qr", "qrcode", "คิวอาร์", "สร้าง qr", "barcode"],
  },
  {
    slug: "image-compressor",
    name: "ย่อ & บีบอัดรูปภาพ",
    description: "ย่อขนาดและบีบอัดรูปภาพในเบราว์เซอร์ ลดขนาดไฟล์โดยไม่อัปโหลดขึ้นเซิร์ฟเวอร์",
    category: "media",
    icon: ImageDown,
    keywords: ["image", "compress", "resize", "รูปภาพ", "ย่อรูป", "บีบอัด", "ลดขนาด"],
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: CategoryId): Tool[] {
  return tools.filter((t) => t.category === category);
}

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
  Lock,
  ReceiptText,
  Banknote,
  Landmark,
  CalendarClock,
  Diff,
  Table,
  ScanLine,
  Dices,
  Split,
  PiggyBank,
  HeartPulse,
  Regex,
  Timer,
  ListOrdered,
  Pilcrow,
  FileCode,
  LandPlot,
  TrendingUp,
  Wallet,
  FileJson,
  Code,
  FileImage,
  Blend,
  Ratio,
  Zap,
  HardDrive,
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
  {
    slug: "text-diff",
    name: "เทียบข้อความ (Diff)",
    description: "เปรียบเทียบข้อความสองชุด ไฮไลต์บรรทัดที่เพิ่ม ลบ และเปลี่ยนแปลง",
    category: "text",
    icon: Diff,
    keywords: ["diff", "เทียบข้อความ", "compare", "เปรียบเทียบ", "ต่าง", "changes"],
  },
  {
    slug: "line-tools",
    name: "จัดการบรรทัด",
    description: "เรียงลำดับ ลบบรรทัดซ้ำ ตัดช่องว่าง กลับลำดับ และลบบรรทัดว่างในข้อความหลายบรรทัด",
    category: "text",
    icon: ListOrdered,
    keywords: ["บรรทัด", "line", "sort", "เรียง", "ลบซ้ำ", "unique", "trim", "reverse"],
  },
  {
    slug: "lorem-ipsum",
    name: "สร้าง Lorem Ipsum",
    description: "สร้างข้อความจำลอง (placeholder) แบบ Lorem Ipsum หรือข้อความไทย ตามจำนวนที่ต้องการ",
    category: "text",
    icon: Pilcrow,
    keywords: ["lorem", "ipsum", "placeholder", "ข้อความจำลอง", "dummy text", "filler"],
  },
  {
    slug: "markdown-preview",
    name: "พรีวิว Markdown",
    description: "แปลง Markdown เป็น HTML และดูตัวอย่างแบบเรียลไทม์ รองรับหัวข้อ ลิสต์ โค้ด และลิงก์",
    category: "text",
    icon: FileCode,
    keywords: ["markdown", "md", "preview", "html", "พรีวิว", "แปลง markdown"],
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
  {
    slug: "age-calculator",
    name: "คำนวณอายุ / นับวัน",
    description: "คำนวณอายุจากวันเกิด (ปี/เดือน/วัน) และนับจำนวนวันระหว่างสองวันที่ พร้อมปี พ.ศ.",
    category: "calc",
    icon: CalendarClock,
    keywords: ["อายุ", "age", "วันเกิด", "นับวัน", "date diff", "ปฏิทิน", "birthday"],
  },
  {
    slug: "random-picker",
    name: "สุ่มรายชื่อ / สุ่มเลข",
    description: "สุ่มเลือกจากรายการ สับลำดับ หรือสุ่มตัวเลขในช่วงที่กำหนด — เหมาะกับจับรางวัลและแบ่งกลุ่ม",
    category: "calc",
    icon: Dices,
    keywords: ["สุ่ม", "random", "จับรางวัล", "สุ่มชื่อ", "สุ่มเลข", "shuffle", "picker"],
  },
  {
    slug: "bill-splitter",
    name: "หารค่าใช้จ่าย",
    description: "หารบิลแบบยืดหยุ่น — กำหนดให้บางคนออกเป็นจำนวนเงินหรือเปอร์เซ็นต์ ที่เหลือหารเท่ากัน",
    category: "calc",
    icon: Split,
    keywords: ["หารบิล", "หารค่าใช้จ่าย", "split", "bill", "หารเงิน", "แชร์", "จ่ายเท่าไหร่"],
  },
  {
    slug: "loan-calculator",
    name: "คำนวณสินเชื่อ / ผ่อนชำระ",
    description: "คำนวณค่างวดต่อเดือน ดอกเบี้ยรวม และตารางผ่อนชำระจากยอดกู้ อัตราดอกเบี้ย และจำนวนงวด",
    category: "calc",
    icon: PiggyBank,
    keywords: ["สินเชื่อ", "ผ่อน", "loan", "ดอกเบี้ย", "ค่างวด", "ผ่อนบ้าน", "ผ่อนรถ", "installment"],
  },
  {
    slug: "bmi-calculator",
    name: "คำนวณ BMI",
    description: "คำนวณดัชนีมวลกาย (BMI) จากส่วนสูงและน้ำหนัก พร้อมบอกเกณฑ์และช่วงน้ำหนักที่เหมาะสม",
    category: "calc",
    icon: HeartPulse,
    keywords: ["bmi", "ดัชนีมวลกาย", "น้ำหนัก", "ส่วนสูง", "อ้วน", "ผอม", "สุขภาพ"],
  },
  {
    slug: "compound-interest",
    name: "ดอกเบี้ยทบต้น / เงินออม",
    description: "คำนวณการเติบโตของเงินออมแบบทบต้น พร้อมเงินฝากรายเดือน และดูผลลัพธ์รายปี",
    category: "calc",
    icon: TrendingUp,
    keywords: ["ดอกเบี้ย", "ทบต้น", "เงินออม", "compound interest", "ออมเงิน", "ลงทุน", "savings"],
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
  {
    slug: "vat-calculator",
    name: "คำนวณ VAT 7%",
    description: "คิดภาษีมูลค่าเพิ่ม 7% — แยก VAT ออกจากราคารวม หรือบวก VAT เข้าราคาก่อนภาษี",
    category: "thai",
    icon: ReceiptText,
    keywords: ["vat", "ภาษีมูลค่าเพิ่ม", "7%", "แยก vat", "บวก vat", "ราคาก่อนภาษี", "ใบกำกับภาษี"],
  },
  {
    slug: "promptpay-qr",
    name: "สร้าง QR พร้อมเพย์",
    description: "สร้าง QR รับเงินพร้อมเพย์ (PromptPay) จากเบอร์มือถือหรือเลขบัตรประชาชน ระบุจำนวนเงินได้",
    category: "thai",
    icon: Banknote,
    keywords: ["พร้อมเพย์", "promptpay", "qr", "รับเงิน", "โอนเงิน", "พร้อมเพย์ qr", "emvco"],
  },
  {
    slug: "income-tax",
    name: "คำนวณภาษีเงินได้บุคคลธรรมดา",
    description: "คำนวณภาษีเงินได้ตามขั้นบันไดของไทย พร้อมค่าลดหย่อนส่วนตัวและค่าใช้จ่าย",
    category: "thai",
    icon: Landmark,
    keywords: ["ภาษี", "เงินได้", "ภงด", "income tax", "ขั้นบันได", "ลดหย่อน", "คำนวณภาษี"],
  },
  {
    slug: "net-salary",
    name: "คำนวณเงินเดือนสุทธิ",
    description: "คำนวณเงินเดือนหลังหักประกันสังคมและภาษี ณ ที่จ่าย เหลือรับจริงต่อเดือน",
    category: "thai",
    icon: Wallet,
    keywords: ["เงินเดือน", "สุทธิ", "net salary", "ประกันสังคม", "sso", "ภาษีหัก ณ ที่จ่าย", "take home"],
  },
  {
    slug: "electricity-bill",
    name: "คำนวณค่าไฟฟ้า",
    description: "ประมาณค่าไฟบ้านตามอัตราก้าวหน้า (ขั้นบันได) พร้อมค่าบริการ ค่า Ft และ VAT 7%",
    category: "thai",
    icon: Zap,
    keywords: ["ค่าไฟ", "ไฟฟ้า", "electricity", "หน่วยไฟ", "kwh", "mea", "pea", "ft", "ขั้นบันได"],
  },
  {
    slug: "thai-land-unit",
    name: "แปลงหน่วยที่ดินไทย",
    description: "แปลงหน่วยที่ดิน ไร่ งาน ตารางวา กับตารางเมตร ตารางฟุต และเอเคอร์",
    category: "thai",
    icon: LandPlot,
    keywords: ["ไร่", "งาน", "ตารางวา", "ที่ดิน", "land", "rai", "ตารางเมตร", "อสังหา"],
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
  {
    slug: "password-generator",
    name: "สร้างรหัสผ่าน",
    description: "สุ่มรหัสผ่านที่ปลอดภัย กำหนดความยาวและชนิดอักขระ พร้อมวัดความแข็งแรง",
    category: "dev",
    icon: Lock,
    keywords: ["password", "รหัสผ่าน", "generate", "สุ่ม", "random", "secure", "strong"],
  },
  {
    slug: "csv-json",
    name: "แปลง CSV ↔ JSON",
    description: "แปลงข้อมูล CSV เป็น JSON และกลับกัน รองรับค่าที่มีเครื่องหมายคำพูดและคอมมา",
    category: "dev",
    icon: Table,
    keywords: ["csv", "json", "convert", "แปลง", "ตาราง", "spreadsheet", "excel"],
  },
  {
    slug: "regex-tester",
    name: "ทดสอบ Regex",
    description: "ทดสอบ Regular Expression กับข้อความ ไฮไลต์ผลที่ตรงและดูกลุ่มที่จับได้แบบเรียลไทม์",
    category: "dev",
    icon: Regex,
    keywords: ["regex", "regular expression", "pattern", "match", "ทดสอบ", "ค้นหา"],
  },
  {
    slug: "number-base",
    name: "แปลงเลขฐาน",
    description: "แปลงตัวเลขระหว่างฐาน 2 (binary), ฐาน 8, ฐาน 10 และฐาน 16 (hex)",
    category: "dev",
    icon: Binary,
    keywords: ["เลขฐาน", "binary", "hex", "octal", "ฐาน 2", "ฐาน 16", "base convert"],
  },
  {
    slug: "cron-explainer",
    name: "อธิบาย Cron",
    description: "แปลง cron expression เป็นคำอธิบายภาษาคน พร้อมแสดงเวลาที่จะทำงานครั้งถัดไป",
    category: "dev",
    icon: Timer,
    keywords: ["cron", "crontab", "schedule", "ตารางเวลา", "อธิบาย cron", "expression"],
  },
  {
    slug: "json-yaml",
    name: "แปลง JSON ↔ YAML",
    description: "แปลงข้อมูลระหว่าง JSON และ YAML ไปมา พร้อมตรวจสอบความถูกต้อง",
    category: "dev",
    icon: FileJson,
    keywords: ["json", "yaml", "yml", "convert", "แปลง", "config"],
  },
  {
    slug: "data-size",
    name: "แปลงหน่วยข้อมูล",
    description: "แปลง Byte, KB, MB, GB, TB (ฐาน 1024 หรือ 1000) พร้อมคำนวณเวลาดาวน์โหลด",
    category: "dev",
    icon: HardDrive,
    keywords: ["byte", "kb", "mb", "gb", "tb", "ขนาดไฟล์", "หน่วยข้อมูล", "download", "ดาวน์โหลด"],
  },
  {
    slug: "escape-unescape",
    name: "Escape / Unescape",
    description: "แปลงอักขระพิเศษ — HTML entity, Unicode (\\uXXXX) และ backslash (\\n \\t) ไปมา",
    category: "dev",
    icon: Code,
    keywords: ["escape", "unescape", "html entity", "unicode", "backslash", "แปลงอักขระ"],
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
  {
    slug: "qr-reader",
    name: "อ่าน QR จากรูป",
    description: "อัปโหลดรูปภาพที่มี QR Code แล้วถอดข้อความ/ลิงก์ออกมา ประมวลผลในเบราว์เซอร์",
    category: "media",
    icon: ScanLine,
    keywords: ["qr", "reader", "scan", "อ่าน qr", "ถอด qr", "สแกน", "decode"],
  },
  {
    slug: "image-base64",
    name: "รูปภาพ → Base64",
    description: "แปลงไฟล์รูปภาพเป็น Base64 / Data URI สำหรับฝังใน HTML หรือ CSS โดยตรง",
    category: "media",
    icon: FileImage,
    keywords: ["base64", "data uri", "รูปภาพ", "image", "embed", "ฝังรูป", "encode"],
  },
  {
    slug: "color-palette",
    name: "จานสี & ไล่เฉด",
    description: "สร้างชุดเฉดสีอ่อน-เข้มจากสีหลัก พร้อมโค้ด HEX และตัวแปร CSS สำหรับดีไซน์",
    category: "media",
    icon: Blend,
    keywords: ["palette", "จานสี", "เฉดสี", "shades", "tints", "สี", "design", "css"],
  },
  {
    slug: "aspect-ratio",
    name: "คำนวณอัตราส่วนภาพ",
    description: "หาอัตราส่วนภาพ (เช่น 16:9) และคำนวณขนาดใหม่โดยรักษาสัดส่วนเดิม",
    category: "media",
    icon: Ratio,
    keywords: ["aspect ratio", "อัตราส่วน", "16:9", "resize", "สัดส่วน", "ขนาดภาพ"],
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: CategoryId): Tool[] {
  return tools.filter((t) => t.category === category);
}

# Utilio 🧰

กล่องเครื่องมืออเนกประสงค์ที่ทำงานบนเบราว์เซอร์ 100% — **ไม่มีหลังบ้าน (no backend)** ข้อมูลทุกอย่างประมวลผลบนเครื่องผู้ใช้ ไม่ถูกส่งขึ้นเซิร์ฟเวอร์

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **HeroUI v3** (คอมโพเนนต์ UI บน React Aria + Tailwind v4)
- **next-themes** (สลับธีมสว่าง/มืด)
- **lucide-react** (ไอคอน)
- Deploy บน **Vercel** (ทุกหน้าเป็น static — ไม่ต้องใช้ server runtime)

## เครื่องมือปัจจุบัน (27 รายการ / 5 หมวด)

| หมวด | เครื่องมือ |
| --- | --- |
| เครื่องมือไทย | จำนวนเงินเป็นตัวหนังสือ (บาทถ้วน), แปลงปี พ.ศ. ↔ ค.ศ., ตรวจเลขบัตรประชาชน, แปลงเลขไทย ↔ อารบิก, คำนวณ VAT 7%, สร้าง QR พร้อมเพย์, คำนวณภาษีเงินได้บุคคลธรรมดา |
| แปลง & จัดข้อความ | แปลงตัวพิมพ์, นับข้อความ, จัดรูปแบบ JSON, Base64, เทียบข้อความ (Diff) |
| สำหรับนักพัฒนา | URL Encode/Decode, สร้าง UUID, สร้าง Hash (SHA), แปลง Timestamp, ถอดรหัส JWT, สร้างรหัสผ่าน, แปลง CSV ↔ JSON |
| คำนวณ & แปลงหน่วย | แปลงหน่วย, คำนวณเปอร์เซ็นต์, คำนวณอายุ / นับวัน, สุ่มรายชื่อ / สุ่มเลข |
| สี & รูปภาพ | แปลงสี (HEX/RGB/HSL), สร้าง QR Code, ย่อ & บีบอัดรูปภาพ, อ่าน QR จากรูป |

## เริ่มพัฒนา

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static)
```

## โครงสร้างโปรเจกต์

```
src/
├─ app/
│  ├─ layout.tsx            # header + footer + metadata + ฟอนต์ (รวมภาษาไทย)
│  ├─ page.tsx              # หน้าหลัก (hero + ค้นหา + การ์ดเครื่องมือ)
│  └─ tools/<slug>/
│     ├─ page.tsx           # Server Component: metadata + ครอบด้วย <ToolPage>
│     └─ <name>.tsx         # Client Component: ตัวเครื่องมือ ("use client")
├─ components/              # Providers (ธีม), SiteHeader, SiteFooter, ToolCard, ToolPage, CopyButton, ToolExplorer
│  └─ ui/                   # ตัวครอบ HeroUI: AppSelect, AppSlider, SegmentedControl
└─ lib/
   └─ tools.ts             # ⭐ registry ของเครื่องมือ + หมวดหมู่ทั้งหมด
```

## การเพิ่มเครื่องมือใหม่

1. เพิ่ม object ใน `tools` ที่ [`src/lib/tools.ts`](src/lib/tools.ts) (กำหนด `slug`, `name`, `description`, `category`, `icon`, `keywords`)
2. สร้างโฟลเดอร์ `src/app/tools/<slug>/`
   - `page.tsx` — Server Component ที่ export `metadata` และเรนเดอร์ `<ToolPage slug="<slug>">`
   - ไฟล์ Client Component สำหรับ logic ของเครื่องมือ (ขึ้นต้นด้วย `"use client"`)

หน้าหลักและการค้นหาจะดึงเครื่องมือใหม่จาก registry ให้อัตโนมัติ

## Deploy บน Vercel

push โปรเจกต์ขึ้น Git แล้ว import เข้า Vercel — ตรวจจับ Next.js อัตโนมัติ ไม่ต้องตั้งค่าอะไรเพิ่ม

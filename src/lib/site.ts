/**
 * URL หลักของเว็บ — ใช้กับ sitemap, robots และ OG image
 * ตั้งค่า NEXT_PUBLIC_SITE_URL ใน environment (เช่นบน Vercel) ให้เป็นโดเมนจริง
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilio.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Utilio";
export const SITE_DESCRIPTION =
  "รวมเครื่องมือออนไลน์อเนกประสงค์ แปลงข้อความ คำนวณ แปลงหน่วย และอื่น ๆ ทำงานบนเบราว์เซอร์ 100% ไม่มีหลังบ้าน ข้อมูลไม่ออกจากเครื่องคุณ";

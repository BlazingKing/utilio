import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { tools } from "@/lib/tools";

export const alt = "Utilio — เครื่องมืออเนกประสงค์ในเบราว์เซอร์";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * ใช้ข้อความละตินล้วนในภาพ เพราะ OG renderer ไม่มีฟอนต์ไทยติดมา
 * (ชื่อ/คำอธิบายภาษาไทยยังอยู่ใน metadata ปกติ)
 */
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/icon-512.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1120",
          color: "#e5e7eb",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={168} height={168} alt="" />
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 28, letterSpacing: -2 }}>
          Utilio
        </div>
        <div style={{ fontSize: 36, color: "#94a3b8", marginTop: 8 }}>
          {`${tools.length} free online tools`}
        </div>
        <div style={{ fontSize: 28, color: "#818cf8", marginTop: 24 }}>
          100% in your browser · no upload · no sign-up
        </div>
      </div>
    ),
    size,
  );
}

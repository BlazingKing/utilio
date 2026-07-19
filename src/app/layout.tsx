import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai"],
});

export const metadata: Metadata = {
  title: {
    default: "Utilio — เครื่องมืออเนกประสงค์ในเบราว์เซอร์",
    template: "%s · Utilio",
  },
  description:
    "รวมเครื่องมือออนไลน์อเนกประสงค์ แปลงข้อความ คำนวณ แปลงหน่วย และอื่น ๆ ทำงานบนเบราว์เซอร์ 100% ไม่มีหลังบ้าน ข้อมูลไม่ออกจากเครื่องคุณ",
  keywords: ["utilio", "เครื่องมือออนไลน์", "แปลงข้อความ", "คำนวณ", "แปลงหน่วย", "utility tools"],
  authors: [{ name: "Utilio" }],
  openGraph: {
    title: "Utilio — เครื่องมืออเนกประสงค์ในเบราว์เซอร์",
    description: "รวมเครื่องมือออนไลน์อเนกประสงค์ ทำงานบนเบราว์เซอร์ 100% ไม่มีหลังบ้าน",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}

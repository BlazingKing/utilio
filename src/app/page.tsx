import { ShieldCheck, Zap, WifiOff } from "lucide-react";
import { ToolExplorer } from "@/components/tool-explorer";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className="text-center">
        <span className="chip mx-auto">✨ เครื่องมือออนไลน์ {tools.length} รายการ</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          กล่องเครื่องมือ<span className="text-brand">อเนกประสงค์</span>
          <br className="hidden sm:block" /> ในเบราว์เซอร์ของคุณ
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          แปลงข้อความ คำนวณ แปลงหน่วย และอีกมากมาย — ทำงานบนเครื่องคุณ 100%
          ไม่ต้องสมัคร ไม่มีหลังบ้าน ข้อมูลไม่ถูกส่งออกไปไหน
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
          <span className="chip">
            <Zap className="h-3.5 w-3.5" /> เร็ว ไม่ต้องรอเซิร์ฟเวอร์
          </span>
          <span className="chip">
            <ShieldCheck className="h-3.5 w-3.5" /> เป็นส่วนตัว
          </span>
          <span className="chip">
            <WifiOff className="h-3.5 w-3.5" /> ใช้งานออฟไลน์ได้
          </span>
        </div>
      </section>

      <section className="mt-12">
        <ToolExplorer />
      </section>
    </div>
  );
}

import { ShieldCheck, Zap, WifiOff } from "lucide-react";
import { Chip } from "@heroui/react";
import { ToolExplorer } from "@/components/tool-explorer";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <section className="text-center">
        <Chip variant="secondary" className="mx-auto">
          ✨ เครื่องมือออนไลน์ {tools.length} รายการ
        </Chip>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          กล่องเครื่องมือ<span className="text-brand">อเนกประสงค์</span>
          <br className="hidden sm:block" /> ในเบราว์เซอร์ของคุณ
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          แปลงข้อความ คำนวณ แปลงหน่วย และอีกมากมาย — ทำงานบนเครื่องคุณ 100%
          ไม่ต้องสมัคร ไม่มีหลังบ้าน ข้อมูลไม่ถูกส่งออกไปไหน
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Chip variant="secondary">
            <Zap className="h-3.5 w-3.5" /> เร็ว ไม่ต้องรอเซิร์ฟเวอร์
          </Chip>
          <Chip variant="secondary">
            <ShieldCheck className="h-3.5 w-3.5" /> เป็นส่วนตัว
          </Chip>
          <Chip variant="secondary">
            <WifiOff className="h-3.5 w-3.5" /> ใช้งานออฟไลน์ได้
          </Chip>
        </div>
      </section>

      <section className="mt-12">
        <ToolExplorer />
      </section>
    </div>
  );
}

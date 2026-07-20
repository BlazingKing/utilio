import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getTool } from "@/lib/tools";
import { TrackRecent } from "@/components/track-recent";

/**
 * โครงหน้าเครื่องมือ — แสดงหัวข้อ/คำอธิบายจาก registry อัตโนมัติ
 * ใช้ครอบ UI ของเครื่องมือแต่ละตัว
 */
export function ToolPage({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const tool = getTool(slug);
  const Icon = tool?.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <TrackRecent slug={slug} />
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        กลับหน้าหลัก
      </Link>

      <div className="mt-4 flex items-start gap-3">
        {Icon && (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="h-5.5 w-5.5" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{tool?.name}</h1>
          <p className="mt-1 text-sm text-muted">{tool?.description}</p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

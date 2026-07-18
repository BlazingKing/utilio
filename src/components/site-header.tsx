import Link from "next/link";
import { Wrench } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
            <Wrench className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="text-lg tracking-tight">
            Utilio
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className="btn-ghost">
            เครื่องมือทั้งหมด
          </Link>
        </nav>
      </div>
    </header>
  );
}

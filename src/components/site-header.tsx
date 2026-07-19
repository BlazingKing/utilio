"use client";

import Link from "next/link";
import { Wrench, Moon, Sun } from "lucide-react";
import { Button, buttonVariants } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      aria-label={isDark ? "ใช้ธีมสว่าง" : "ใช้ธีมมืด"}
      onPress={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </Button>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
            <Wrench className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="text-lg tracking-tight">Utilio</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className={buttonVariants({ variant: "tertiary", size: "sm" })}>
            เครื่องมือทั้งหมด
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { Input, Card } from "@heroui/react";
import { categories, tools } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";

export function ToolExplorer() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return tools;
    return tools.filter((t) => {
      const haystack = [t.name, t.description, ...t.keywords].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [q]);

  return (
    <div>
      <div className="relative mb-8">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาเครื่องมือ... (เช่น json, แปลงหน่วย, base64)"
          aria-label="ค้นหาเครื่องมือ"
          fullWidth
          className="pl-11"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 px-4 py-16 text-center text-muted">
          <SearchX className="h-8 w-8" />
          <p>
            ไม่พบเครื่องมือที่ตรงกับ &ldquo;<span className="text-foreground">{query}</span>&rdquo;
          </p>
        </Card>
      ) : q ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {categories.map((cat) => {
            const catTools = filtered.filter((t) => t.category === cat.id);
            if (catTools.length === 0) return null;
            const CatIcon = cat.icon;
            return (
              <section key={cat.id}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-brand">
                    <CatIcon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h2 className="font-semibold leading-tight">{cat.name}</h2>
                    <p className="text-xs text-muted">{cat.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

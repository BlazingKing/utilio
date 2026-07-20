"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, Star, History } from "lucide-react";
import { Input, Card } from "@heroui/react";
import { categories, tools, getTool } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";
import { useFavorites, useRecent } from "@/lib/tool-prefs";

export function ToolExplorer() {
  const [query, setQuery] = useState("");
  const { favorites, toggleFavorite } = useFavorites();
  const recent = useRecent();

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return tools;
    return tools.filter((t) => {
      const haystack = [t.name, t.description, ...t.keywords].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [q]);

  const favoriteTools = favorites.map((s) => getTool(s)).filter((t) => t !== undefined);
  const recentTools = recent
    .filter((s) => !favorites.includes(s))
    .map((s) => getTool(s))
    .filter((t) => t !== undefined);

  const cardProps = (slug: string) => ({
    isFavorite: favorites.includes(slug),
    onToggleFavorite: toggleFavorite,
  });

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
            <ToolCard key={tool.slug} tool={tool} {...cardProps(tool.slug)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {favoriteTools.length > 0 && (
            <Section
              icon={<Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />}
              title="เครื่องมือโปรด"
              description="ที่คุณปักหมุดไว้"
            >
              {favoriteTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} {...cardProps(tool.slug)} />
              ))}
            </Section>
          )}

          {recentTools.length > 0 && (
            <Section
              icon={<History className="h-4.5 w-4.5" />}
              title="ใช้ล่าสุด"
              description="เครื่องมือที่เพิ่งเปิด"
            >
              {recentTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} {...cardProps(tool.slug)} />
              ))}
            </Section>
          )}

          {categories.map((cat) => {
            const catTools = filtered.filter((t) => t.category === cat.id);
            if (catTools.length === 0) return null;
            const CatIcon = cat.icon;
            return (
              <Section
                key={cat.id}
                icon={<CatIcon className="h-4.5 w-4.5" />}
                title={cat.name}
                description={cat.description}
              >
                {catTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} {...cardProps(tool.slug)} />
                ))}
              </Section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-brand">
          {icon}
        </span>
        <div>
          <h2 className="font-semibold leading-tight">{title}</h2>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

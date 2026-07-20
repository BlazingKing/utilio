"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Card } from "@heroui/react";
import type { Tool } from "@/lib/tools";

export function ToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
}: {
  tool: Tool;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
}) {
  const Icon = tool.icon;
  return (
    <div className="group relative">
      <Link href={`/tools/${tool.slug}`} className="block">
        <Card className="h-full gap-3 p-5 transition-all group-hover:border-brand group-hover:shadow-lg group-hover:shadow-brand/5">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand" />
          </div>
          <div>
            <Card.Title className="pr-7 font-semibold">{tool.name}</Card.Title>
            <Card.Description className="mt-1 line-clamp-2 text-sm text-muted">
              {tool.description}
            </Card.Description>
          </div>
        </Card>
      </Link>

      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(tool.slug);
          }}
          aria-label={isFavorite ? `เอา ${tool.name} ออกจากรายการโปรด` : `เพิ่ม ${tool.name} เข้ารายการโปรด`}
          aria-pressed={isFavorite}
          className="absolute bottom-4 right-4 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-amber-500"
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
        </button>
      )}
    </div>
  );
}

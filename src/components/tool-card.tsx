import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@heroui/react";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <Card className="h-full gap-3 p-5 transition-all group-hover:border-brand group-hover:shadow-lg group-hover:shadow-brand/5">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="h-5 w-5" />
          </span>
          <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand" />
        </div>
        <div>
          <Card.Title className="font-semibold">{tool.name}</Card.Title>
          <Card.Description className="mt-1 line-clamp-2 text-sm text-muted">
            {tool.description}
          </Card.Description>
        </div>
      </Card>
    </Link>
  );
}

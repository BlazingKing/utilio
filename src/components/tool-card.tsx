import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card group flex flex-col gap-3 p-5 transition-all hover:border-brand hover:shadow-lg hover:shadow-brand/5"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand" />
      </div>
      <div>
        <h3 className="font-semibold">{tool.name}</h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">{tool.description}</p>
      </div>
    </Link>
  );
}

import type { Metadata } from "next";
import { getTool } from "@/lib/tools";
import { ToolPage } from "@/components/tool-page";
import { AspectRatio } from "./aspect-ratio";

const slug = "aspect-ratio";
const tool = getTool(slug)!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
};

export default function Page() {
  return (
    <ToolPage slug={slug}>
      <AspectRatio />
    </ToolPage>
  );
}

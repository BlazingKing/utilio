import type { Metadata } from "next";
import { getTool } from "@/lib/tools";
import { ToolPage } from "@/components/tool-page";
import { ThaiLandUnit } from "./thai-land-unit";

const slug = "thai-land-unit";
const tool = getTool(slug)!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
};

export default function Page() {
  return (
    <ToolPage slug={slug}>
      <ThaiLandUnit />
    </ToolPage>
  );
}

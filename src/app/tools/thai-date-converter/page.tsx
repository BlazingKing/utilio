import type { Metadata } from "next";
import { getTool } from "@/lib/tools";
import { ToolPage } from "@/components/tool-page";
import { ThaiDateConverter } from "./thai-date-converter";

const slug = "thai-date-converter";
const tool = getTool(slug)!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
};

export default function Page() {
  return (
    <ToolPage slug={slug}>
      <ThaiDateConverter />
    </ToolPage>
  );
}

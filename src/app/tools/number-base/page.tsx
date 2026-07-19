import type { Metadata } from "next";
import { getTool } from "@/lib/tools";
import { ToolPage } from "@/components/tool-page";
import { NumberBase } from "./number-base";

const slug = "number-base";
const tool = getTool(slug)!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
};

export default function Page() {
  return (
    <ToolPage slug={slug}>
      <NumberBase />
    </ToolPage>
  );
}

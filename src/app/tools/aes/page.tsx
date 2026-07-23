import type { Metadata } from "next";
import { getTool } from "@/lib/tools";
import { ToolPage } from "@/components/tool-page";
import { AesTool } from "./aes";

const slug = "aes";
const tool = getTool(slug)!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
};

export default function Page() {
  return (
    <ToolPage slug={slug}>
      <AesTool />
    </ToolPage>
  );
}

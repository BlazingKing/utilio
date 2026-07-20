"use client";

import { useEffect } from "react";
import { recordRecent } from "@/lib/tool-prefs";

/** บันทึกเครื่องมือที่เพิ่งเปิด — ไม่เรนเดอร์อะไร */
export function TrackRecent({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecent(slug);
  }, [slug]);

  return null;
}

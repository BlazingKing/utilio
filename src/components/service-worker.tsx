"use client";

import { useEffect } from "react";

/** ลงทะเบียน service worker เพื่อให้ใช้งานออฟไลน์ได้ (ทำเฉพาะ production) */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ลงทะเบียนไม่สำเร็จ — เว็บยังใช้งานได้ตามปกติ
      });
    };

    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}

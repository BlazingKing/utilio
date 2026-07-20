"use client";

import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "utilio:favorites";
const RECENT_KEY = "utilio:recent";
const RECENT_MAX = 6;

/** อ่านรายการ slug จาก localStorage แบบปลอดภัย (SSR / โหมดปิด storage) */
function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage ไม่พร้อมใช้งาน — ข้ามไป
  }
}

/** เครื่องมือโปรด — อ่านหลัง mount เพื่อเลี่ยง hydration mismatch */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(read(FAV_KEY));
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      write(FAV_KEY, next);
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}

/** เครื่องมือที่เพิ่งใช้ */
export function useRecent() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(read(RECENT_KEY));
  }, []);

  return recent;
}

/** บันทึกว่าเพิ่งเปิดเครื่องมือนี้ (เรียกจากหน้าเครื่องมือ) */
export function recordRecent(slug: string) {
  const next = [slug, ...read(RECENT_KEY).filter((s) => s !== slug)].slice(0, RECENT_MAX);
  write(RECENT_KEY, next);
}

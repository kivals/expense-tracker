"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "@expense-tracker/shared-types";
import { listCategories } from "@/features/categories/api/categories-api";

export function useCategories(enabled = true) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    listCategories()
      .then((data) => {
        if (cancelled) return;
        setCategories(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Не удалось загрузить категории");
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const byId = useMemo(() => {
    const map = new Map<string, Category>();
    for (const c of categories) map.set(c.id, c);
    return map;
  }, [categories]);

  return { categories, byId, isLoading, error };
}

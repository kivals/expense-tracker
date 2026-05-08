"use client";

import type { Category, Transaction } from "@expense-tracker/shared-types";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

type Props = {
  items: Transaction[];
  categoriesById: Map<string, Category>;
  isLoading?: boolean;
  error?: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const amountFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function TransactionList({ items, categoriesById, isLoading, error }: Props) {
  if (isLoading && items.length === 0) {
    return <p className="text-muted-foreground text-sm">Загрузка...</p>;
  }
  if (error) {
    return <p className="text-destructive text-sm">{error}</p>;
  }
  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">Транзакций пока нет.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((t) => {
        const category = categoriesById.get(t.categoryId);
        const isExpense = t.type === "expense";
        const sign = isExpense ? "-" : "+";
        return (
          <Card key={t.id}>
            <CardContent className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                {category && (
                  <span
                    className="inline-block size-3 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                    aria-hidden
                  />
                )}
                <div className="min-w-0">
                  <div className="font-medium truncate">{t.description || "Без описания"}</div>
                  <div className="text-muted-foreground text-xs">
                    {dateFormatter.format(new Date(t.date))}
                    {category ? ` · ${category.name}` : ""}
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "font-semibold tabular-nums",
                  isExpense ? "text-red-600" : "text-emerald-600",
                )}
              >
                {sign}
                {amountFormatter.format(Number(t.amount))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

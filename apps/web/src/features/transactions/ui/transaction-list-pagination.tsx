"use client";

import { Button } from "@/shared/ui/button";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
};

export function TransactionListPagination({
  page,
  totalPages,
  onPrev,
  onNext,
  disabled,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={disabled || page <= 1}
      >
        Назад
      </Button>
      <span className="text-muted-foreground text-sm">
        Страница {page} из {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        onClick={onNext}
        disabled={disabled || page >= totalPages}
      >
        Вперёд
      </Button>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Transaction,
  TransactionsAggregate,
} from "@expense-tracker/shared-types";
import { listTransactions } from "@/features/transactions/api/transactions-api";

type State = {
  items: Transaction[];
  aggregate: TransactionsAggregate;
  total: number;
  isLoading: boolean;
  error: string | null;
};

const initialAggregate: TransactionsAggregate = {
  totalIncome: "0",
  totalExpense: "0",
  balance: "0",
};

export function useRecentTransactions(limit = 10, enabled = true) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<State>({
    items: [],
    aggregate: initialAggregate,
    total: 0,
    isLoading: enabled,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    listTransactions({ page, limit })
      .then((res) => {
        if (cancelled) return;
        setState({
          items: res.items,
          aggregate: res.aggregate,
          total: res.pagination.total,
          isLoading: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Не удалось загрузить транзакции",
        }));
      });
    return () => {
      cancelled = true;
    };
  }, [page, limit, enabled]);

  const totalPages = Math.max(1, Math.ceil(state.total / limit));
  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);
  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  return {
    items: state.items,
    aggregate: state.aggregate,
    total: state.total,
    isLoading: state.isLoading,
    error: state.error,
    page,
    totalPages,
    nextPage,
    prevPage,
    setPage,
  };
}

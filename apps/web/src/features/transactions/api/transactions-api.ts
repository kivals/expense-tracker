import type { TransactionsListResponse } from "@expense-tracker/shared-types";
import { apiRequest } from "@/shared/api/client";

export type ListTransactionsParams = {
  page?: number;
  limit?: number;
  month?: number;
  year?: number;
};

export function listTransactions(
  params: ListTransactionsParams = {},
): Promise<TransactionsListResponse> {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.month !== undefined) search.set("month", String(params.month));
  if (params.year !== undefined) search.set("year", String(params.year));

  const qs = search.toString();
  const path = qs ? `/transactions?${qs}` : "/transactions";
  return apiRequest<TransactionsListResponse>(path, { method: "GET" });
}

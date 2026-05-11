import type { Category } from "@expense-tracker/shared-types";
import { apiRequest } from "@/shared/api/client";

export function listCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories", { method: "GET" });
}

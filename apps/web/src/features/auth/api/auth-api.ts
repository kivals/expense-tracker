import type { AuthResponse, LoginPayload, RegisterPayload } from "@expense-tracker/shared-types";
import { apiRequest } from "@/shared/api/client";

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: payload });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: payload });
}

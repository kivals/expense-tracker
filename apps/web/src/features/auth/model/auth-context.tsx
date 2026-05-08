"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PublicUser } from "@expense-tracker/shared-types";
import {
  AUTH_TOKEN_KEY,
  clearAuthToken,
  setAuthToken,
} from "@/shared/api/auth-storage";
import { getMe } from "@/features/auth/api/auth-api";
import { UnauthorizedError } from "@/shared/api/client";

type AuthState = {
  user: PublicUser | null;
  token: string | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  setAuth: (token: string, user: PublicUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setState({ user: null, token: null, isLoading: false });
      return;
    }
    setState({ user: null, token, isLoading: true });
    getMe()
      .then((user) => {
        if (cancelled) return;
        setState({ user, token, isLoading: false });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          clearAuthToken();
        }
        setState({ user: null, token: null, isLoading: false });
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setState({ user: null, token: null, isLoading: false });
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const setAuth = useCallback((token: string, user: PublicUser) => {
    setAuthToken(token);
    setState({ user, token, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setState({ user: null, token: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

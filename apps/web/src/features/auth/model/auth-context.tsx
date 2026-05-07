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

const TOKEN_KEY = "auth_token";

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
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Токен есть, но user восстановить из localStorage нельзя без /me эндпоинта.
      // Храним минимум — только признак авторизации.
      setState({ user: null, token, isLoading: false });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const setAuth = useCallback((token: string, user: PublicUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    setState({ user, token, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
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

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  approval_status: "pending" | "approved" | "rejected";
  erp_contact_id?: number | null;
  orders_count?: number;
  prices_visible?: boolean;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isApproved: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: validate stored token by fetching current user
  useEffect(() => {
    const stored = localStorage.getItem("auth_token");
    if (!stored) {
      queueMicrotask(() => setIsLoading(false));
      return;
    }
    api
      .get<User>("/users/me")
      .then((res) => {
        setToken(stored);
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{
      access_token: string;
      user: User;
    }>("/auth/login", { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem("auth_token", access_token);
    setToken(access_token);
    setUser(userData);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["product"] }),
    ]);
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore errors — clear local state regardless
    }
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    queryClient.removeQueries({ queryKey: ["products"] });
    queryClient.removeQueries({ queryKey: ["product"] });
  }, [queryClient]);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isApproved: user?.approval_status === "approved",
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

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
import { isAxiosError } from "axios";
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
const COOKIE_AUTH_ENABLED = process.env.NEXT_PUBLIC_COOKIE_AUTH === "true";
const CACHED_USER_KEY = "fastweb_auth_user";

function readCachedUser(): User | null {
  try {
    const value = localStorage.getItem(CACHED_USER_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<User>;
    return typeof parsed.id === "number" && typeof parsed.name === "string" && typeof parsed.email === "string"
      ? (parsed as User)
      : null;
  } catch {
    return null;
  }
}

function cacheUser(user: User | null) {
  if (user) localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CACHED_USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleExpiredSession = () => {
      setToken(null);
      setUser(null);
      cacheUser(null);
      queryClient.clear();
    };
    window.addEventListener("auth:expired", handleExpiredSession);
    return () => window.removeEventListener("auth:expired", handleExpiredSession);
  }, [queryClient]);

  // On mount: validate stored token by fetching current user
  useEffect(() => {
    const stored = localStorage.getItem("auth_token");
    if (!stored && !COOKIE_AUTH_ENABLED) {
      cacheUser(null);
      queueMicrotask(() => setIsLoading(false));
      return;
    }
    const cachedUser = readCachedUser();
    if (cachedUser) queueMicrotask(() => setUser(cachedUser));
    api
      .get<User>("/users/me")
      .then((res) => {
        setToken(stored);
        setUser(res.data);
        cacheUser(res.data);
      })
      .catch((error: unknown) => {
        // A temporary network/backend failure must not destroy a valid local
        // session. Only a definitive unauthorized response signs the user out.
        if (isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          cacheUser(null);
          setToken(null);
          setUser(null);
        } else if (cachedUser) {
          setToken(stored);
          setUser(cachedUser);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{
      access_token?: string;
      user: User;
    }>("/auth/login", { email, password });
    const { access_token, user: userData } = res.data;
    queryClient.clear();
    if (access_token && !COOKIE_AUTH_ENABLED) localStorage.setItem("auth_token", access_token);
    setToken(access_token ?? null);
    setUser(userData);
    cacheUser(userData);
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
    cacheUser(null);
    setToken(null);
    setUser(null);
    queryClient.clear();
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

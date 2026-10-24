import axios, { type AxiosAdapter } from "axios";
import { tokenStore, type TokenStore } from "./authToken";

interface ApiClientOptions {
  /** API origin without the `/api` suffix. */
  baseURL: string;
  tokens: TokenStore;
  onSessionExpired?: () => void;
  /** Tests only: replaces the HTTP transport. */
  adapter?: AxiosAdapter;
}

export function createApiClient({ baseURL, tokens, onSessionExpired, adapter }: ApiClientOptions) {
  // Only send credentials (cookies) when the backend is running in cookie-auth
  // mode. Combining `withCredentials: true` with a backend that responds
  // `Access-Control-Allow-Origin: *` (no cookie support yet) causes the
  // browser to block every response — see SECURITY_BACKEND_REQUIREMENTS.md.
  const withCredentials = tokens.cookieAuth;

  const api = axios.create({
    baseURL: baseURL + "/api",
    withCredentials,
    headers: { "Content-Type": "application/json" },
    adapter,
  });
  // Refresh calls bypass the interceptors below (no retry loop on a failed refresh).
  const refreshClient = axios.create({ baseURL: baseURL + "/api", withCredentials, adapter });

  // Attach auth token to every request (bearer mode only; tokens.get() is null in cookie mode)
  api.interceptors.request.use((config) => {
    const token = tokens.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Track in-flight refresh to avoid duplicate refresh calls
  let refreshPromise: Promise<string | null> | null = null;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      if (error.response?.status !== 401 || !original || original._retry) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        if (!refreshPromise) {
          const storedToken = tokens.get();
          refreshPromise = refreshClient
            .post("/auth/refresh", {}, {
              headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : undefined,
            })
            .then((res) => {
              const token: string | null = res.data?.access_token ?? null;
              tokens.set(token);
              return token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
        if (tokens.cookieAuth) {
          // The refreshed session cookie is the credential; never replay a bearer header.
          delete original.headers.Authorization;
        } else {
          if (!newToken) throw new Error("Refresh returned no token");
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(original);
      } catch {
        tokens.clear();
        onSessionExpired?.();
        return Promise.reject(error);
      }
    }
  );

  return api;
}

const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  tokens: tokenStore,
  onSessionExpired: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:expired"));
    }
  },
});

export default api;

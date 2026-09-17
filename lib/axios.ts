import axios from "axios";

// Only send credentials (cookies) when the backend is running in cookie-auth
// mode. Combining `withCredentials: true` with a backend that responds
// `Access-Control-Allow-Origin: *` (no cookie support yet) causes the
// browser to block every response — see SECURITY_BACKEND_REQUIREMENTS.md.
const COOKIE_AUTH_ENABLED = process.env.NEXT_PUBLIC_COOKIE_AUTH === "true";

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") + "/api",
  withCredentials: COOKIE_AUTH_ENABLED,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Track in-flight refresh to avoid duplicate refresh calls
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        const storedToken = localStorage.getItem("auth_token");
        refreshPromise = axios
          .post(
            (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000") +
              "/api/auth/refresh",
            {},
            {
              withCredentials: COOKIE_AUTH_ENABLED,
              headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : undefined,
            }
          )
          .then((res) => {
            const token: string = res.data.access_token;
            if (token) localStorage.setItem("auth_token", token);
            return token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      // Do not log a user out because of an offline/timeout/5xx response.
      // Clear the session only when the backend definitively rejects it.
      if (
        axios.isAxiosError(refreshError) &&
        (refreshError.response?.status === 401 || refreshError.response?.status === 403)
      ) {
        localStorage.removeItem("auth_token");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:expired"));
        }
      }
      return Promise.reject(error);
    }
  }
);

export default api;

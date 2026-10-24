/**
 * The only place that reads or writes the API credential in browser storage.
 *
 * - Bearer mode (default): the JWT from login, refresh and password change is kept in localStorage and sent
 *   as `Authorization: Bearer …`.
 * - Cookie mode (`NEXT_PUBLIC_COOKIE_AUTH=true`): the API's HttpOnly session cookie is the credential. No token
 *   is ever written to or read from localStorage, and a token left over from bearer mode is removed, so page
 *   scripts (and therefore XSS) cannot read it. See SECURITY_BACKEND_REQUIREMENTS.md for the API side.
 */
export const COOKIE_AUTH_ENABLED = process.env.NEXT_PUBLIC_COOKIE_AUTH === "true";

const STORAGE_KEY = "auth_token";

type TokenStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export interface TokenStore {
  readonly cookieAuth: boolean;
  /** The bearer token to send, or null (always null in cookie mode). */
  get(): string | null;
  /** Keep a token returned by the API (ignored in cookie mode). */
  set(token: string | null | undefined): void;
  clear(): void;
}

export function createTokenStore(cookieAuth: boolean, storage: () => TokenStorage | null): TokenStore {
  const clear = () => storage()?.removeItem(STORAGE_KEY);
  return {
    cookieAuth,
    get() {
      if (cookieAuth) {
        clear();
        return null;
      }
      return storage()?.getItem(STORAGE_KEY) ?? null;
    },
    set(token) {
      if (cookieAuth) {
        clear();
        return;
      }
      if (token) storage()?.setItem(STORAGE_KEY, token);
    },
    clear,
  };
}

export const tokenStore = createTokenStore(COOKIE_AUTH_ENABLED, () =>
  typeof window === "undefined" ? null : window.localStorage
);

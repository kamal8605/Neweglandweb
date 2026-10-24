import { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it, vi } from "vitest";
import { createTokenStore } from "./authToken";
import { createApiClient } from "./axios";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

interface Sent {
  url: string;
  authorization: string | undefined;
  withCredentials: boolean | undefined;
}

/**
 * A fake API (no network): `/auth/refresh` answers with `refreshToken` (or 401 when null); any other request
 * answers 401 until a refresh has happened, then 200.
 */
function setup({ cookieAuth, stored, refreshToken }: { cookieAuth: boolean; stored?: string; refreshToken: string | null }) {
  const storage = memoryStorage(stored ? { auth_token: stored } : {});
  const tokens = createTokenStore(cookieAuth, () => storage);
  const sent: Sent[] = [];
  let refreshed = false;

  const respond = (config: InternalAxiosRequestConfig, status: number, data: unknown) => {
    const response = { data, status, statusText: String(status), headers: {}, config };
    if (status >= 400) throw new AxiosError("fail", "ERR_BAD_REQUEST", config, null, response);
    return response;
  };
  const adapter: AxiosAdapter = async (config) => {
    sent.push({
      url: config.url ?? "",
      authorization: AxiosHeaders.from(config.headers).get("Authorization") as string | undefined,
      withCredentials: config.withCredentials,
    });
    if (config.url === "/auth/refresh") {
      if (refreshToken === null) return respond(config, 401, {});
      refreshed = true;
      return respond(config, 200, { access_token: refreshToken });
    }
    return refreshed ? respond(config, 200, { ok: true }) : respond(config, 401, {});
  };

  const onSessionExpired = vi.fn();
  const api = createApiClient({ baseURL: "https://api.test", tokens, onSessionExpired, adapter });
  return { api, storage, sent, onSessionExpired };
}

describe("API client, bearer mode", () => {
  it("attaches the stored token and does not send cookies", async () => {
    const { api, sent } = setup({ cookieAuth: false, stored: "old", refreshToken: "new" });
    await api.get("/orders");
    expect(sent[0]).toEqual({ url: "/orders", authorization: "Bearer old", withCredentials: false });
  });

  it("refreshes on 401, stores the new token and retries with it", async () => {
    const { api, sent, storage } = setup({ cookieAuth: false, stored: "old", refreshToken: "new" });
    await expect(api.get("/orders")).resolves.toMatchObject({ data: { ok: true } });
    expect(sent.map((s) => [s.url, s.authorization])).toEqual([
      ["/orders", "Bearer old"],
      ["/auth/refresh", "Bearer old"],
      ["/orders", "Bearer new"],
    ]);
    expect(storage.data.get("auth_token")).toBe("new");
  });

  it("shares one refresh between concurrent 401s", async () => {
    const { api, sent } = setup({ cookieAuth: false, stored: "old", refreshToken: "new" });
    await Promise.all([api.get("/orders"), api.get("/wishlist")]);
    expect(sent.filter((s) => s.url === "/auth/refresh")).toHaveLength(1);
  });

  it("clears the token and signals expiry when the refresh fails", async () => {
    const { api, storage, onSessionExpired } = setup({ cookieAuth: false, stored: "old", refreshToken: null });
    await expect(api.get("/orders")).rejects.toMatchObject({ response: { status: 401 } });
    expect(storage.data.has("auth_token")).toBe(false);
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });
});

describe("API client, cookie mode", () => {
  it("sends cookies and never a bearer header, even with a stale stored token", async () => {
    const { api, sent, storage } = setup({ cookieAuth: true, stored: "stale", refreshToken: "ignored" });
    await api.get("/orders");
    expect(sent[0]).toEqual({ url: "/orders", authorization: undefined, withCredentials: true });
    expect(storage.data.has("auth_token")).toBe(false);
  });

  it("refreshes via cookie without storing or replaying a returned token", async () => {
    const { api, sent, storage } = setup({ cookieAuth: true, refreshToken: "leaked-token" });
    await expect(api.get("/orders")).resolves.toMatchObject({ data: { ok: true } });
    expect(sent).toEqual([
      { url: "/orders", authorization: undefined, withCredentials: true },
      { url: "/auth/refresh", authorization: undefined, withCredentials: true },
      { url: "/orders", authorization: undefined, withCredentials: true },
    ]);
    expect(storage.data.size).toBe(0);
  });

  it("signals expiry when the cookie refresh fails", async () => {
    const { api, onSessionExpired } = setup({ cookieAuth: true, refreshToken: null });
    await expect(api.get("/orders")).rejects.toMatchObject({ response: { status: 401 } });
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });
});

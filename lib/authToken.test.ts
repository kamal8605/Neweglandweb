import { describe, expect, it } from "vitest";
import { createTokenStore } from "./authToken";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

describe("token store, bearer mode", () => {
  it("stores, returns and clears the token", () => {
    const storage = memoryStorage();
    const tokens = createTokenStore(false, () => storage);
    tokens.set("abc");
    expect(tokens.get()).toBe("abc");
    expect(storage.data.get("auth_token")).toBe("abc");
    tokens.clear();
    expect(tokens.get()).toBeNull();
  });

  it("ignores empty tokens", () => {
    const storage = memoryStorage();
    const tokens = createTokenStore(false, () => storage);
    tokens.set(undefined);
    tokens.set(null);
    tokens.set("");
    expect(storage.data.size).toBe(0);
  });

  it("returns null when there is no browser storage (server render)", () => {
    const tokens = createTokenStore(false, () => null);
    tokens.set("abc");
    expect(tokens.get()).toBeNull();
  });
});

describe("token store, cookie mode", () => {
  it("never writes a token to storage", () => {
    const storage = memoryStorage();
    const tokens = createTokenStore(true, () => storage);
    tokens.set("from-login-or-refresh");
    expect(storage.data.size).toBe(0);
    expect(tokens.get()).toBeNull();
  });

  it("never returns, and removes, a token left over from bearer mode", () => {
    const storage = memoryStorage({ auth_token: "stale" });
    const tokens = createTokenStore(true, () => storage);
    expect(tokens.get()).toBeNull();
    expect(storage.data.has("auth_token")).toBe(false);
  });
});

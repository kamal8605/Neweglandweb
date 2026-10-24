import axios, { type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it, vi } from "vitest";
import { isValidOrderId, orderApiPath, requestOrder } from "./orderId";

// Values a crafted `/orders/[id]` link (decoded by Next) or a caller bug could produce.
const INVALID_IDS: unknown[] = [
  "",
  " 42",
  "42 ",
  "-1",
  "4.2",
  "1e3",
  "0x2A",
  "..",
  "../users/me",
  "../../up",
  "..%2Fwishlist",
  "42%2F..",
  "42/items",
  "42\\..",
  "42?per_page=1000",
  "42#x",
  "４２", // full-width digits
  -1,
  4.2,
  1e21,
  Number.NaN,
  Number.POSITIVE_INFINITY,
  {},
  [],
  ["42"],
  null,
  undefined,
];

describe("isValidOrderId / orderApiPath", () => {
  it.each(["42", "1", "0", "007", 42, 0])("accepts %j", (id) => {
    expect(isValidOrderId(id)).toBe(true);
    expect(orderApiPath(id)).toBe(`/orders/${String(id)}`);
  });

  it.each(INVALID_IDS)("rejects %j", (id) => {
    expect(isValidOrderId(id)).toBe(false);
    expect(orderApiPath(id)).toBeNull();
  });
});

describe("requestOrder", () => {
  it.each(INVALID_IDS)("never calls the API getter for %j", async (id) => {
    const get = vi.fn(async () => ({ data: {} }));
    await expect(requestOrder(get, id)).rejects.toThrow("Invalid order id");
    expect(get).not.toHaveBeenCalled();
  });

  it("requests /orders/<id> exactly once for a valid id", async () => {
    const get = vi.fn(async (path: string) => ({ data: { path } }));
    await expect(requestOrder(get, "42")).resolves.toEqual({ data: { path: "/orders/42" } });
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("/orders/42");
  });
});

describe("requestOrder through a real Axios client (no network)", () => {
  function client() {
    const urls: string[] = [];
    const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
      urls.push(axios.getUri(config));
      return { data: { id: 42 }, status: 200, statusText: "OK", headers: {}, config };
    };
    const api = axios.create({ baseURL: "https://api.test/api", adapter });
    return { urls, get: (path: string) => api.get(path) };
  }

  it("builds exactly https://api.test/api/orders/42 for a valid id", async () => {
    const { urls, get } = client();
    await requestOrder(get, "42");
    expect(urls).toEqual(["https://api.test/api/orders/42"]);
    expect(new URL(urls[0]).search).toBe("");
    expect(new URL(urls[0]).hash).toBe("");
  });

  it("never reaches the transport for path-changing or query-injecting ids", async () => {
    const { urls, get } = client();
    for (const id of ["../users/me", "..%2Fwishlist", "../../up", "42?per_page=1000", "42#x", ".."]) {
      await expect(requestOrder(get, id)).rejects.toThrow();
    }
    expect(urls).toEqual([]);
  });
});

import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { QueryClientProvider, useQuery, type QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getQueryClient } from "./queryClient";

/** Server-renders one "request" whose component reads a user-specific query. */
function renderRequest(client: QueryClient, userId: number, queryFn: () => Promise<unknown>) {
  function Orders() {
    useQuery({ queryKey: ["orders", userId], queryFn });
    return null;
  }
  renderToString(createElement(QueryClientProvider, { client }, createElement(Orders)));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getQueryClient on the server", () => {
  it("returns a new client for every call", () => {
    expect(getQueryClient()).not.toBe(getQueryClient());
  });

  it("keeps each request's query cache isolated", () => {
    const queryFn = vi.fn(async () => ({ secret: true }));
    const requestA = getQueryClient();
    const requestB = getQueryClient();
    renderRequest(requestA, 1, queryFn);
    renderRequest(requestB, 2, queryFn);

    expect(requestA.getQueryCache().getAll().map((q) => q.queryKey)).toEqual([["orders", 1]]);
    expect(requestB.getQueryCache().getAll().map((q) => q.queryKey)).toEqual([["orders", 2]]);
    // Current impact: queries are registered during SSR but never fetched there (no data, no credentials).
    expect(queryFn).not.toHaveBeenCalled();
  });

  it("(why) a shared server client would accumulate every request's queries and never collect them", () => {
    const shared = getQueryClient();
    renderRequest(shared, 1, async () => null);
    renderRequest(shared, 2, async () => null);
    const queries = shared.getQueryCache().getAll();
    expect(queries).toHaveLength(2);
    expect(queries.every((q) => q.gcTime === Infinity)).toBe(true);
  });
});

describe("getQueryClient in the browser", () => {
  it("reuses one client so the cache survives navigation", () => {
    vi.stubGlobal("window", {});
    expect(getQueryClient()).toBe(getQueryClient());
  });
});

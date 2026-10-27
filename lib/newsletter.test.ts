import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { subscribeToNewsletter } from "./newsletter";

const failWith = (status: number) => () =>
  Promise.reject(new AxiosError("failed", "ERR", undefined, undefined, { status, data: {}, statusText: "", headers: {}, config: { headers: new AxiosHeaders() } } as AxiosResponse));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("subscribeToNewsletter", () => {
  it("posts the client key, trimmed e-mail and honeypot to /newsletter", async () => {
    vi.stubEnv("NEXT_PUBLIC_HOMEPAGE_CLIENT", "new-england");
    const post = vi.fn().mockResolvedValue({ data: { message: "Thanks for subscribing." } });

    await expect(subscribeToNewsletter(post, "  buyer@example.com ")).resolves.toEqual({ ok: true, message: "Thanks for subscribing." });
    expect(post).toHaveBeenCalledWith("/newsletter", { client: "new-england", email: "buyer@example.com", website: "" });
  });

  it.each([
    [404, "unavailable"],
    [422, "invalid"],
    [429, "rate_limited"],
    [500, "error"],
  ])("maps HTTP %i to %s", async (status, reason) => {
    await expect(subscribeToNewsletter(failWith(status), "a@example.com")).resolves.toMatchObject({ ok: false, reason });
  });

  it("treats a network failure as a generic error", async () => {
    await expect(subscribeToNewsletter(() => Promise.reject(new Error("offline")), "a@example.com")).resolves.toMatchObject({ ok: false, reason: "error" });
  });
});

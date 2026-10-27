import { readFileSync } from "node:fs";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from "next/constants";
import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig, { contentSecurityPolicy } from "./next.config";

const PROD_API = "https://hotpink-parrot-228156.hostingersite.com";

function load(phase: string, env: Record<string, string | undefined>) {
  vi.stubEnv("NEXT_PUBLIC_API_URL", env.NEXT_PUBLIC_API_URL);
  vi.stubEnv("IMAGE_CDN_URL", env.IMAGE_CDN_URL);
  vi.stubEnv("CSP_CONNECT_SRC_EXTRA", env.CSP_CONNECT_SRC_EXTRA);
  return nextConfig(phase);
}

const imageHosts = (config: ReturnType<typeof nextConfig>) =>
  (config.images?.remotePatterns ?? []).map((p) => (p instanceof URL ? p.href : `${p.protocol}://${p.hostname}`));

async function headersFor(config: ReturnType<typeof nextConfig>) {
  const rules = (await config.headers?.()) ?? [];
  expect(rules.map((r) => r.source)).toEqual(["/(.*)"]);
  return Object.fromEntries(rules[0].headers.map((h) => [h.key, h.value]));
}

const directive = (csp: string, name: string) => csp.split("; ").find((d) => d.startsWith(`${name} `) || d === name);

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("image allowlist (FE-SEC-009)", () => {
  it.each([PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER])("%s with the production API allows no loopback or http hosts", (phase) => {
    const hosts = imageHosts(load(phase, { NEXT_PUBLIC_API_URL: PROD_API }));
    expect(hosts.filter((h) => /localhost|127\.0\.0\.1|^http:/.test(h))).toEqual([]);
    // Legitimate production sources are kept.
    expect(hosts).toContain("https://hotpink-parrot-228156.hostingersite.com/storage/**");
    expect(hosts).toContain("https://hotpink-parrot-228156.hostingersite.com/api/media/**");
  });

  it("production with no API URL configured fails closed (no loopback hosts)", () => {
    const hosts = imageHosts(load(PHASE_PRODUCTION_BUILD, {}));
    expect(hosts.some((h) => /localhost|127\.0\.0\.1/.test(h))).toBe(false);
  });

  it("allows loopback storage on the dev server and for a build against a local API", () => {
    for (const config of [
      load(PHASE_DEVELOPMENT_SERVER, { NEXT_PUBLIC_API_URL: PROD_API }),
      load(PHASE_PRODUCTION_BUILD, { NEXT_PUBLIC_API_URL: "http://localhost:8000" }),
    ]) {
      expect(imageHosts(config)).toEqual(expect.arrayContaining(["http://127.0.0.1:8000/storage/**", "http://localhost:8000/storage/**"]));
    }
  });

  it("lifts the private-IP image guard only on the dev server or for a local API", () => {
    expect(load(PHASE_DEVELOPMENT_SERVER, { NEXT_PUBLIC_API_URL: "http://127.0.0.1:8000" }).images?.dangerouslyAllowLocalIP).toBe(true);
    expect(load(PHASE_PRODUCTION_BUILD, { NEXT_PUBLIC_API_URL: "http://localhost:8000" }).images?.dangerouslyAllowLocalIP).toBe(true);
    for (const phase of [PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER]) {
      expect(load(phase, { NEXT_PUBLIC_API_URL: PROD_API }).images?.dangerouslyAllowLocalIP).toBe(false);
      expect(load(phase, {}).images?.dangerouslyAllowLocalIP).toBe(false);
    }
  });

  it("keeps the configured IMAGE_CDN_URL pattern", () => {
    const hosts = imageHosts(load(PHASE_PRODUCTION_BUILD, { NEXT_PUBLIC_API_URL: PROD_API, IMAGE_CDN_URL: "https://cdn.example.com/**" }));
    expect(hosts[0]).toBe("https://cdn.example.com/**");
  });
});

describe("security headers (FE-SEC-007)", () => {
  it("production: CSP connect-src is limited to this site and the API", async () => {
    const headers = await headersFor(load(PHASE_PRODUCTION_BUILD, { NEXT_PUBLIC_API_URL: `${PROD_API}/` }));
    const csp = headers["Content-Security-Policy"];
    expect(directive(csp, "connect-src")).toBe(`connect-src 'self' ${PROD_API}`);
    expect(directive(csp, "upgrade-insecure-requests")).toBeDefined();
    // Existing protections are preserved.
    for (const d of ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "worker-src 'self' blob:"]) {
      expect(csp.split("; ")).toContain(d);
    }
    expect(directive(csp, "script-src")).toBe("script-src 'self' 'unsafe-inline'");
    expect(headers).toMatchObject({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    });
  });

  it("never allows arbitrary origins, wildcards or non-http schemes in connect-src", () => {
    const csp = contentSecurityPolicy({
      apiUrl: PROD_API,
      extraConnectSrc: "https://files.example.com, https: * javascript:alert(1) data:text/plain,x wss://socket.example.com",
    });
    expect(directive(csp, "connect-src")).toBe(`connect-src 'self' ${PROD_API} https://files.example.com`);
  });

  it("a build against a local http API omits upgrade-insecure-requests so it keeps working", () => {
    const csp = contentSecurityPolicy({ apiUrl: "http://localhost:8000" });
    expect(directive(csp, "connect-src")).toBe("connect-src 'self' http://localhost:8000");
    expect(directive(csp, "upgrade-insecure-requests")).toBeUndefined();
  });

  it("dev server: other security headers apply but no CSP (HMR)", async () => {
    const headers = await headersFor(load(PHASE_DEVELOPMENT_SERVER, { NEXT_PUBLIC_API_URL: PROD_API }));
    expect(headers["Content-Security-Policy"]).toBeUndefined();
    expect(headers["X-Frame-Options"]).toBe("DENY");
  });

  it("vercel.json no longer defines its own security headers (single source in next.config.ts)", () => {
    const vercel = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));
    const keys = vercel.headers.flatMap((rule: { headers: { key: string }[] }) => rule.headers.map((h) => h.key));
    expect(keys).not.toContain("Content-Security-Policy");
    expect(keys).not.toContain("Strict-Transport-Security");
  });
});

describe("unchanged build configuration", () => {
  it("keeps the pdfjs aliases and image qualities", () => {
    const config = load(PHASE_PRODUCTION_BUILD, { NEXT_PUBLIC_API_URL: PROD_API });
    expect(config.turbopack?.resolveAlias).toEqual({ "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.mjs" });
    expect(typeof config.webpack).toBe("function");
    expect(config.images?.qualities).toEqual([75]);
  });
});

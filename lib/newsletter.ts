import { isAxiosError } from "axios";
import { homepageClientKey } from "@/lib/homepage";

export type NewsletterResult =
  | { ok: true; message: string }
  | { ok: false; reason: "unavailable" | "invalid" | "rate_limited" | "error"; message: string };

type Post = (path: string, body: Record<string, string>) => Promise<{ data: unknown }>;

const messageOf = (data: unknown) => (typeof data === "object" && data !== null && typeof (data as { message?: unknown }).message === "string" ? (data as { message: string }).message : null);

/**
 * POST /api/newsletter (gateway NewsletterController). The API answers the same for new and existing addresses.
 * `website` is the honeypot field; real visitors leave it empty.
 */
export async function subscribeToNewsletter(post: Post, email: string, website = ""): Promise<NewsletterResult> {
  try {
    const response = await post("/newsletter", { client: homepageClientKey(), email: email.trim(), website });
    return { ok: true, message: messageOf(response.data) ?? "Thanks for subscribing." };
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 404) return { ok: false, reason: "unavailable", message: "Newsletter signup is not available right now." };
    if (status === 422) return { ok: false, reason: "invalid", message: "Please enter a valid email address." };
    if (status === 429) return { ok: false, reason: "rate_limited", message: "Too many attempts. Please try again later." };
    return { ok: false, reason: "error", message: "Something went wrong. Please try again." };
  }
}

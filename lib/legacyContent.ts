/**
 * TRANSITIONAL: content this storefront hard-coded before the API managed it. Used only when a /api/homepage response
 * does not contain the key at all, i.e. a backend older than the release that added `site_settings.nicotine_warning`,
 * `site_settings.app_store_url`, `site_settings.play_store_url` and product-row `settings.badge` (it always sends
 * them, null when unset). Delete this file once that backend is live in production.
 */
export const LEGACY_NICOTINE_WARNING = "WARNING: This product contains nicotine. Nicotine is an addictive chemical.";
export const LEGACY_APP_STORE_URL = "https://apps.apple.com/in/app/new-england-distribution/id6741199522";
export const LEGACY_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.brainbean.newengland";

/** Old backend only: the New Arrivals row showed a "New" ribbon based on its title. */
export function legacyBadgeForTitle(title: string): string | null {
  return /new arrivals?/i.test(title) ? "New" : null;
}

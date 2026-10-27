import type { Category } from "@/hooks/useCategories";
import type { SiteSettings } from "@/context/SiteConfigContext";

export type NavGroup = NonNullable<SiteSettings["nav_groups"]>[number];

/** Most sub-categories one mega-menu panel shows; "View all" links to the rest. */
const MAX_MENU_ITEMS = 18;

function matches(category: Category, keywords: readonly string[]) {
  const value = `${category.name} ${category.slug}`.toLowerCase();
  return keywords.some((keyword) => value.includes(keyword.toLowerCase()));
}

function categoryItems(category: Category) {
  return category.children && category.children.length > 0 ? category.children : [category];
}

/**
 * Admin-defined nav groups (site_settings.nav_groups) filled with the /categories whose name or slug contains one of
 * the group's keywords. A group that matches nothing stays empty and links to its own URL (or /shop); it is never
 * given an unrelated category.
 */
export function buildNavGroups(groups: readonly NavGroup[], categories: readonly Category[]) {
  return groups.map((group) => {
    const roots = categories.filter((category) => matches(category, group.keywords));
    return {
      ...group,
      items: roots.flatMap(categoryItems).slice(0, MAX_MENU_ITEMS),
      href: group.url || (roots[0] ? `/category/${roots[0].id}` : "/shop"),
    };
  });
}

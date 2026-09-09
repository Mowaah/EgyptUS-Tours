export const DESERT_CATEGORIES = [
  "Western Desert",
  "Sinai Desert",
  "Oasis Desert",
  "Safari Trips",
] as const;

export type DesertCategory = (typeof DESERT_CATEGORIES)[number];

/**
 * Checks whether a given string corresponds to one of the 4 desert categories.
 */
export function isDesertCategory(val?: string | null): boolean {
  if (!val) return false;
  const normalized = val.trim().toLowerCase();
  return DESERT_CATEGORIES.some((cat) => {
    const catLower = cat.toLowerCase();
    const catSlug = catLower.replace(/\s+/g, "-");
    return (
      normalized === catLower ||
      normalized === catSlug ||
      (catLower.includes("safari") && normalized.includes("safari"))
    );
  });
}

/**
 * Checks if a collection of tags (either strings or tag objects) contains any desert category.
 */
export function hasDesertCategory(
  tags?: Array<string | { name?: string; slug?: string }> | null
): boolean {
  if (!Array.isArray(tags) || tags.length === 0) return false;
  return tags.some((tag) => {
    if (typeof tag === "string") {
      return isDesertCategory(tag);
    }
    return isDesertCategory(tag?.name) || isDesertCategory(tag?.slug);
  });
}

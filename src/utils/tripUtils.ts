export interface CategoryLike {
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
}

export interface TripLike {
  kind?: string;
  category?: string;
  tags?: Array<{ id?: string | number; name?: string; slug?: string } | string>;
  tagObjects?: Array<{ id?: string | number; name?: string; slug?: string }>;
}

export const DAY_TOUR_PAX_BRACKETS = [
  { key: "solo", label: "Solo", minPax: 1, maxPax: 1 },
  { key: "2_4", label: "2-4 Pax", minPax: 2, maxPax: 4 },
  { key: "5_8", label: "5-8 Pax", minPax: 5, maxPax: 8 },
  { key: "9_20", label: "9-20 Pax", minPax: 9, maxPax: 20 },
] as const;

export function isDayTourText(text?: string | null): boolean {
  if (!text) return false;
  return /day[\s-_]?tour/i.test(text);
}

export function isDayTourCategory(categoryValue?: string | null, categories?: CategoryLike[]): boolean {
  if (!categoryValue) return false;
  if (isDayTourText(categoryValue)) return true;

  if (categories && categories.length > 0) {
    const matched = categories.find(
      (c) => String(c.id) === String(categoryValue) || c.slug === categoryValue
    );
    if (matched) {
      return isDayTourText(matched.name) || isDayTourText(matched.slug) || isDayTourText(matched.title);
    }
  }

  return false;
}

export function isDayTour(trip?: TripLike | null, categories?: CategoryLike[]): boolean {
  if (!trip) return false;
  if (trip.kind === "day_tour") return true;

  if (isDayTourCategory(trip.category, categories)) return true;

  if (Array.isArray(trip.tags)) {
    for (const tag of trip.tags) {
      if (typeof tag === "string" && isDayTourText(tag)) return true;
      if (typeof tag === "object" && tag) {
        if (isDayTourText(tag.name) || isDayTourText(tag.slug)) return true;
      }
    }
  }

  if (Array.isArray(trip.tagObjects)) {
    for (const tag of trip.tagObjects) {
      if (tag && (isDayTourText(tag.name) || isDayTourText(tag.slug))) return true;
    }
  }

  return false;
}

export function getBracketForPax(pax: number) {
  for (const bracket of DAY_TOUR_PAX_BRACKETS) {
    if (pax >= bracket.minPax && pax <= bracket.maxPax) {
      return bracket;
    }
  }
  return DAY_TOUR_PAX_BRACKETS[DAY_TOUR_PAX_BRACKETS.length - 1];
}

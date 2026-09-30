export const HOTEL_ROOM_VIEW_OPTIONS = [
  { value: "Sea View", key: "sea", aliases: ["mar"] },
  { value: "Pool View", key: "pool", aliases: ["piscina"] },
  { value: "Garden View", key: "garden", aliases: ["jard", "giard"] },
  { value: "City View", key: "city", aliases: ["ciudad", "citt"] },
  { value: "Nile View", key: "nile", aliases: ["nilo"] },
  { value: "Pyramids View", key: "pyramids", aliases: ["piramid"] },
] as const;

export type HotelRoomViewKey = (typeof HOTEL_ROOM_VIEW_OPTIONS)[number]["key"];

export function getHotelRoomViewKey(value: string | null | undefined): HotelRoomViewKey | undefined {
  const normalized = (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
  return HOTEL_ROOM_VIEW_OPTIONS.find(({ value: label, key, aliases }) => {
    const normalizedLabel = label.toLowerCase();
    return normalized === key || normalized === normalizedLabel || normalized.includes(key) || aliases.some((alias) => normalized.includes(alias));
  })?.key;
}

export function getHotelRoomViewLabel(value: string | null | undefined): string {
  const key = getHotelRoomViewKey(value);
  return HOTEL_ROOM_VIEW_OPTIONS.find((option) => option.key === key)?.value || (value || "Garden View").trim();
}

import type { PlanDestination } from "./planYourTripTypes";

export function filterDestinations(list: PlanDestination[], search: string): PlanDestination[] {
  const q = search.trim().toLowerCase();
  if (!q) return list;
  return list.filter((d) => d.name.toLowerCase().includes(q));
}

export function clampMin0(n: number) {
  return Math.max(0, n);
}

export function toggleInArray(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

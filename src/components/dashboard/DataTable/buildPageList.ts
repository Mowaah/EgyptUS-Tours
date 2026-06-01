/** Builds a smart page list with ellipsis, e.g. [1, 2, 3, '...', 13, 14, 15] */
export function buildPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1, 2, 3];
  if (current > 4) pages.push("...");
  if (current > 3 && current < total - 2) pages.push(current);
  if (current < total - 3) pages.push("...");
  pages.push(total - 2, total - 1, total);

  return pages.filter((v, i, arr) => {
    if (v === "...") return true;
    return arr.indexOf(v) === i;
  });
}

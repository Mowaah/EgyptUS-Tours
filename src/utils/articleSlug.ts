/** Convert a stored article or blog slug into a stable, URL-friendly permalink. */
export function toArticleSlug(value: string | null | undefined): string {
  let decodedValue = value || "";
  try {
    decodedValue = decodeURIComponent(decodedValue);
  } catch {
    // Keep the original value if it contains an incomplete percent escape.
  }

  return decodedValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z0-9])\.([a-z0-9])/gi, "$1$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

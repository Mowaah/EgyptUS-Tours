/**
 * Formats a given date into DD/MM/YYYY format (e.g. "09/10/2026").
 * Supports Date objects, ISO strings (YYYY-MM-DD), slash-formatted strings, and general date strings.
 *
 * @param value The date input (string, Date, null, or undefined)
 * @param fallback Fallback string if value is missing or invalid (defaults to "")
 * @returns Formatted date string in DD/MM/YYYY
 */
export function formatDateDDMMYYYY(
  value?: string | Date | null,
  fallback: string = ""
): string {
  if (!value) return fallback;

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return fallback;
    const dd = String(value.getDate()).padStart(2, "0");
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const yyyy = value.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  const str = String(value).trim();
  if (!str || str === "—" || str === "-") return fallback;

  // 1. ISO format or YYYY-MM-DD / YYYY/MM/DD (e.g., "2026-10-09" or "2026-10-09T00:00:00.000Z")
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const [, yyyy, mm, dd] = ymdMatch;
    return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
  }

  // 2. Dash format DD-MM-YYYY (e.g., "09-10-2026")
  const dmyDashMatch = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmyDashMatch) {
    const [, dd, mm, yyyy] = dmyDashMatch;
    return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
  }

  // 3. Slash format (e.g. "10/09/2026", "09/10/2026", "9/10/2026")
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, part1, part2, yyyy] = slashMatch;
    const n1 = parseInt(part1, 10);
    const n2 = parseInt(part2, 10);

    // If part1 > 12, part1 must be the day (DD/MM/YYYY)
    if (n1 > 12) {
      return `${part1.padStart(2, "0")}/${part2.padStart(2, "0")}/${yyyy}`;
    }
    // If part2 > 12, part2 must be the day (MM/DD/YYYY) -> swap to DD/MM/YYYY
    if (n2 > 12) {
      return `${part2.padStart(2, "0")}/${part1.padStart(2, "0")}/${yyyy}`;
    }
    // Both <= 12: preserve as DD/MM/YYYY with padding
    return `${part1.padStart(2, "0")}/${part2.padStart(2, "0")}/${yyyy}`;
  }

  // 4. Try parsing as a Date (e.g., "Oct 9, 2026", "Fri, Oct 9, 2026", etc.)
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const dd = String(parsed.getDate()).padStart(2, "0");
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const yyyy = parsed.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  return str;
}

/**
 * Safely parses various date formats into a local Date object.
 */
export function parseDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  const str = String(value).trim();
  if (!str || str === "—" || str === "-") return null;

  // YYYY-MM-DD
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  }

  // DD/MM/YYYY or MM/DD/YYYY
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, p1, p2, y] = slashMatch;
    const n1 = parseInt(p1, 10);
    const n2 = parseInt(p2, 10);
    // If n1 > 12, it's definitely DD/MM/YYYY
    if (n1 > 12) {
      return new Date(parseInt(y, 10), n2 - 1, n1);
    }
    // If n2 > 12, it's definitely MM/DD/YYYY
    if (n2 > 12) {
      return new Date(parseInt(y, 10), n1 - 1, n2);
    }
    // Default assumption for slash dates in DD/MM/YYYY context: p1 is DD, p2 is MM
    return new Date(parseInt(y, 10), n2 - 1, n1);
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

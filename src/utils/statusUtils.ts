import type { StatusPillVariant } from "@/components/shared/StatusPill/StatusPill";

export type StatusIconType = "dot" | "spinner" | "check" | "x" | "none";

export interface StatusConfig {
  label: string;
  variant: StatusPillVariant;
  iconType: StatusIconType;
}

/**
 * Normalizes and formats raw status strings from backend APIs into user-friendly labels.
 */
export function formatStatusLabel(rawStatus?: string | null): string {
  if (!rawStatus) return "Unknown";
  const s = rawStatus.trim().toLowerCase();

  switch (s) {
    case "awaiting_deposit":
      return "30% Pending Payment";
    case "awaiting_payment":
      return "100% Pending Payment";
    case "refund_in_progress":
      return "Refund in Progress";
    case "refunded":
      return "Refunded";
    case "refund_completed":
      return "Refund Completed";
    case "partially_paid":
      return "Partially Paid";
    case "fully_paid":
      return "Fully Paid";
    case "deposit_paid":
      return "Deposit Paid";
    case "proposal_in_progress":
      return "In Progress";
    case "proposal_ready":
      return "Proposal Ready";
    case "proposal_sent":
      return "Proposal Sent";
    case "in_trip":
      return "In Trip";
    case "in_stay":
    case "in_hotel":
      return "In Hotel";
    case "in_transit":
      return "In Transit";
    case "on_trip":
      return "On Trip";
    default:
      return rawStatus
        .replace(/[-_]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
  }
}

/**
 * Determines the StatusPillVariant color token matching the admin dashboard table.
 */
export function getStatusVariant(status?: string | null): StatusPillVariant {
  if (!status) return "gray";
  const s = status.toLowerCase().replace(/[-_]/g, " ").trim();

  if (s.includes("refund")) return "darkBlue";
  if (s === "new") return "green";
  if (s.includes("in progress")) return "orangeDark";
  if (s.includes("proposal ready")) return "teal";
  if (s.includes("proposal sent")) return "orangeLight";
  if (s.includes("rejected")) return "redSoft";
  if (s.includes("cancelled") || s.includes("canceled")) return "redSoft";
  if (s.includes("negotiation")) return "grayDark";
  if (s.includes("awaiting") || s.includes("pending payment")) return "pinkSoft";
  if (s.includes("deposit paid")) return "lightBlue";
  if (s.includes("fully paid")) return "purple";
  if (s.includes("in stay") || s.includes("in hotel")) return "orange";
  if (s.includes("in trip") || s.includes("in transit") || s.includes("on trip")) return "magenta";
  if (s.includes("completed")) return "green";
  if (s.includes("overdue")) return "red";
  if (s.includes("upcoming")) return "blue";
  if (s.includes("partially paid") || s.includes("pending")) return "orange";
  if (s.includes("paid") || s.includes("confirmed") || s.includes("approved") || s.includes("converted")) return "green";
  if (s.includes("closed")) return "grayDark";

  return "gray";
}

/**
 * Returns the recommended icon type (spinner, check, x, dot) for a status.
 */
export function getStatusIconType(status?: string | null): StatusIconType {
  if (!status) return "dot";
  const s = status.toLowerCase().replace(/[-_]/g, " ").trim();

  // Refund states
  if (s.includes("refund in progress") || s === "refund_in_progress") {
    return "spinner";
  }
  if (s.includes("refunded") || s === "refunded" || s.includes("refund completed")) {
    return "check";
  }

  // Pending / In progress states -> Spinner
  if (
    s.includes("in progress") ||
    s.includes("pending") ||
    s.includes("partially paid") ||
    s.includes("awaiting") ||
    s.includes("in trip") ||
    s.includes("in stay") ||
    s.includes("in transit") ||
    s.includes("on trip")
  ) {
    return "spinner";
  }

  // Success / Completed / Confirmed states -> Checkmark
  if (
    s.includes("confirmed") ||
    s.includes("paid") ||
    s.includes("completed") ||
    s.includes("proposal sent") ||
    s.includes("approved") ||
    s.includes("converted")
  ) {
    return "check";
  }

  // Negative terminal states -> X
  if (s.includes("rejected") || s.includes("cancelled") || s.includes("canceled") || s.includes("overdue")) {
    return "x";
  }

  // Neutral / other states -> Dot
  return "dot";
}

/**
 * Complete status configuration package for a given status string.
 */
export function getStatusConfig(rawStatus?: string | null): StatusConfig {
  return {
    label: formatStatusLabel(rawStatus),
    variant: getStatusVariant(rawStatus),
    iconType: getStatusIconType(rawStatus),
  };
}

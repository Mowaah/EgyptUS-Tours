import type { PolicyId } from "./policyModalTypes";

/** Map link label or href to a policy tab ("terms" or "privacy"). */
export function getPolicyIdFromLink(link: { label: string; href: string }): PolicyId {
  const label = link.label.toLowerCase();
  const href = link.href.toLowerCase();

  if (label.includes("terms") || href.includes("terms")) return "terms";
  if (label.includes("privacy") || href.includes("privacy")) return "privacy";
  if (label.includes("policy") || href.includes("policy")) return "privacy";
  if (label.includes("cancellation") || href.includes("cancellation")) return "privacy";
  if (label.includes("children") || href.includes("children")) return "privacy";
  if (label.includes("booking") || href.includes("booking")) return "privacy";
  if (label.includes("tipping") || href.includes("tipping")) return "privacy";

  return "terms";
}

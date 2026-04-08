import type { PolicyId } from "./policyModalTypes";

/** Map CMS / mock link label or href to a policy tab. */
export function getPolicyIdFromLink(link: { label: string; href: string }): PolicyId {
  const label = link.label.toLowerCase();
  const href = link.href.toLowerCase();

  if (label.includes("cancellation") || href.includes("cancellation")) return "cancellation";
  if (label.includes("children") || href.includes("children")) return "children";
  if (label.includes("booking") || href.includes("booking")) return "booking";
  if (label.includes("tipping") || href.includes("tipping")) return "tipping";
  if (label.includes("terms") || href.includes("terms")) return "terms";

  return "terms";
}

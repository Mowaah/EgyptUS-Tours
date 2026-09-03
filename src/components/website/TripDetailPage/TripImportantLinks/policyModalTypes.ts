export type PolicyId = "terms" | "privacy" | "children" | "booking" | "tipping" | "cancellation";

export interface LegalTabOption {
  id: "terms" | "privacy";
  labelKey: "termsTitle" | "privacyTitle";
  fallback: string;
}

export const POLICY_TABS: LegalTabOption[] = [
  { id: "terms", labelKey: "termsTitle", fallback: "Terms & Conditions" },
  { id: "privacy", labelKey: "privacyTitle", fallback: "Privacy & Policy" },
];

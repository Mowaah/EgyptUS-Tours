export interface PromotionRow {
  id: string;
  offerId: string;
  title: string;
  value: string;
  appliesTo: "Trips" | "Transportation" | "Hotels";
  validFrom: string;
  validTo: string;
  status: "Active" | "Inactive" | "Draft";
  usage: number | string;
}

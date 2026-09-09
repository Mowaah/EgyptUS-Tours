import { adminDataClient } from "@/lib/adminCoreApi";

export interface ExchangeRatesData {
  usd_to_egp_rate: string | null;
  usd_to_eur_rate: string | null;
  updated_at: string;
}

export interface ExchangeRatesUpdatePayload {
  usd_to_egp_rate: string;
  usd_to_eur_rate: string;
}

export const getExchangeRates = async (): Promise<ExchangeRatesData> => {
  const response = await adminDataClient.get("/system-config/");
  const data = response as unknown as Record<string, unknown>;
  return {
    usd_to_egp_rate: (data?.usd_to_egp_rate as string) || null,
    usd_to_eur_rate: (data?.usd_to_eur_rate as string) || null,
    updated_at: (data?.updated_at as string) || "",
  };
};

export const updateExchangeRates = async (
  payload: ExchangeRatesUpdatePayload
): Promise<ExchangeRatesData> => {
  const response = await adminDataClient.patch("/system-config/", payload);
  const data = response as unknown as Record<string, unknown>;
  return {
    usd_to_egp_rate: (data?.usd_to_egp_rate as string) || null,
    usd_to_eur_rate: (data?.usd_to_eur_rate as string) || null,
    updated_at: (data?.updated_at as string) || "",
  };
};

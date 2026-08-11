import useSWR from 'swr';
import { getSeoConfig, updateSeoConfig, SeoConfigPayload, SeoConfigResponse } from '@/services/admin/adminSeoService';

export function useAdminSeo(pageKey: string) {
  const { data, error, isLoading, mutate } = useSWR<SeoConfigResponse>(
    pageKey ? `/api/admin/seo-config/${pageKey}/` : null,
    () => getSeoConfig(pageKey)
  );

  const updateConfig = async (payload: SeoConfigPayload) => {
    try {
      const updated = await updateSeoConfig(pageKey, payload);
      mutate(updated, false);
      return updated;
    } catch (err) {
      console.error('Failed to update SEO config:', err);
      throw err;
    }
  };

  return {
    data,
    loading: isLoading,
    error,
    updateConfig,
    refetch: mutate,
  };
}

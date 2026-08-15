import useSWR from 'swr';
import { getCatalogVehicles, getVehicleCategories, getCatalogVehicleDetail } from '@/services/admin/adminCatalogVehiclesService';
import { getVehicleAdditionalServices } from '@/services/admin/adminCatalogVehicleAdditionalServicesService';

export function useCatalogVehicles(params: Record<string, unknown> = {}) {
  const { data: res, isLoading: loading, error, mutate: refetch } = useSWR(
    ["adminCatalogVehicles", params],
    () => getCatalogVehicles(params),
    { keepPreviousData: true }
  );

  const results = res?.data?.results || res?.results || res?.data || res;
  const data = Array.isArray(results) ? results : [];
  const totalCount = res?.count || data.length || 0;

  return { data, loading, error, refetch, totalCount };
}

export function useVehicleCategories() {
  const { data: res, isLoading: loading, error, mutate: refetch } = useSWR(
    "adminVehicleCategories",
    () => getVehicleCategories({ limit: 1000, page_size: 1000 }),
    { keepPreviousData: true }
  );

  const results = res?.data?.results || res?.results || res?.data || res;
  const categories = Array.isArray(results) ? results : [];

  return { categories, loading, error, refetch };
}

export function useCatalogVehicleDetail(id: string | number | undefined) {
  const { data: res, isLoading: loading, error, mutate: refetch } = useSWR(
    id ? ["adminCatalogVehicleDetail", id] : null,
    () => getCatalogVehicleDetail(id as string | number)
  );

  const data = res?.data || res || null;

  return { data, loading, error, refetch };
}

export function useVehicleAdditionalServices(params: Record<string, unknown> = {}) {
  const { data: res, isLoading: loading, error, mutate: refetch } = useSWR(
    ["adminVehicleAdditionalServices", params],
    () => getVehicleAdditionalServices(params),
    { keepPreviousData: true }
  );

  const results = res?.data?.results || res?.results || res?.data || res;
  const services = Array.isArray(results) ? results : [];
  const totalCount = res?.count || services.length || 0;

  return { services, loading, error, refetch, totalCount };
}

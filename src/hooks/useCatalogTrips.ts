"use client";

import useSWR from "swr";
import { getCatalogTrips, getCatalogTripDetail, getCategories, getDestinations } from "@/services/admin/adminCatalogTripsService";

export function useCatalogTrips(filters: any) {
  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    ["adminCatalogTrips", filters],
    () => getCatalogTrips(filters),
    { keepPreviousData: true }
  );

  const data = Array.isArray(res?.data) 
    ? res.data 
    : res?.data?.results ?? res?.results ?? (Array.isArray(res) ? res : []) ?? [];
  const totalCount = res?.count || data.length || 0;

  return {
    data,
    loading,
    totalCount,
    refetch,
  };
}

export function useCatalogTripDetail(id: string | number | undefined) {
  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    id ? ["adminCatalogTripDetail", id] : null,
    () => getCatalogTripDetail(id as string | number)
  );

  const trip = res?.data || res || null;

  return {
    trip,
    loading,
    refetch,
  };
}

export function useCatalogFilters() {
  const { data: res, isLoading: loading } = useSWR(
    "adminCatalogTripsFilters",
    () => Promise.all([
      getCategories({ limit: 1000, page_size: 1000 }),
      getDestinations({ limit: 1000, page_size: 1000 })
    ])
  );

  const catRes = res?.[0];
  const destRes = res?.[1];

  const cats = catRes?.results || catRes?.data?.results || (Array.isArray(catRes?.data) ? catRes.data : []) || (Array.isArray(catRes) ? catRes : []);
  const dests = destRes?.results || destRes?.data?.results || (Array.isArray(destRes?.data) ? destRes.data : []) || (Array.isArray(destRes) ? destRes : []);

  return {
    categories: cats,
    destinations: dests,
    loading,
  };
}

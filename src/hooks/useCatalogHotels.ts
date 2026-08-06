"use client";

import useSWR from "swr";
import { getCatalogHotels, getCatalogHotelDetail, getCatalogHotelLocations } from "@/services/admin/adminCatalogHotelsService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCatalogHotels(filters: any) {
  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    ["adminCatalogHotels", filters],
    () => getCatalogHotels({ ...filters, limit: 1000, page_size: 1000 }),
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

export function useCatalogHotelDetail(id: string | number | undefined) {
  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    id ? ["adminCatalogHotelDetail", id] : null,
    () => getCatalogHotelDetail(id as string | number)
  );

  const hotel = res?.data || res || null;

  return {
    hotel,
    loading,
    refetch,
  };
}

export function useCatalogHotelLocations() {
  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    "adminCatalogHotelLocations",
    () => getCatalogHotelLocations({ limit: 1000, page_size: 1000 }),
    { keepPreviousData: true }
  );

  const locations = Array.isArray(res?.data) 
    ? res.data 
    : res?.data?.results ?? res?.results ?? (Array.isArray(res) ? res : []) ?? [];

  return {
    locations,
    loading,
    refetch,
  };
}

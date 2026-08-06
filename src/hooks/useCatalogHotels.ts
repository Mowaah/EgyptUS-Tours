"use client";

import { useState, useEffect, useCallback } from "react";
import { getCatalogHotels, getCatalogHotelDetail, getCatalogHotelLocations } from "@/services/admin/adminCatalogHotelsService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCatalogHotels(filters: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      let page = 1;
      const pageSize = 10;
      let allResults: any[] = [];
      let total = 0;
      let hasMore = true;

      while (hasMore) {
        const res = await getCatalogHotels({ ...filters, page_size: pageSize, page });
        if (page === 1) total = res.count || 0;
        
        const results = res.results || [];
        allResults = [...allResults, ...results];
        
        if (results.length < pageSize || !res.next) {
          hasMore = false;
        } else {
          page++;
        }
      }
      
      setData(allResults);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch catalog hotels:", err);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return {
    data,
    loading,
    totalCount,
    refetch: fetchHotels,
  };
}

export function useCatalogHotelDetail(id: string | number) {
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHotel = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getCatalogHotelDetail(id);
      setHotel(res);
    } catch (err) {
      console.error("Failed to fetch hotel detail:", err);
      setHotel(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  return {
    hotel,
    loading,
    refetch: fetchHotel,
  };
}

export function useCatalogHotelLocations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFilters = useCallback(async () => {
    setLoading(true);
    try {
      let locResults: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const [locRes] = await Promise.all([
          hasMore ? getCatalogHotelLocations({ page_size: 100, page }).catch(() => ({ results: [] })) : { results: [] }
        ]);

        if (locRes.results?.length > 0) {
          locResults = [...locResults, ...locRes.results];
        }

        if ((locRes.results?.length || 0) < 100 || !locRes.next) {
          hasMore = false;
        }

        page++;
      }

      setLocations(locResults);
    } catch (err) {
      console.error("Failed to fetch hotel filter locations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return {
    locations,
    loading,
    refetch: fetchFilters,
  };
}

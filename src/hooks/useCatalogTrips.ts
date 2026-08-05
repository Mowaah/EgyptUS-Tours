"use client";

import { useState, useEffect, useCallback } from "react";
import { getCatalogTrips, getCatalogTripDetail, getCategories, getDestinations } from "@/services/admin/adminCatalogTripsService";

export function useCatalogTrips(filters: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      let page = 1;
      const pageSize = 10;
      let allResults: any[] = [];
      let total = 0;
      let hasMore = true;

      while (hasMore) {
        const res = await getCatalogTrips({ ...filters, page_size: pageSize, page });
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
      console.error("Failed to fetch catalog trips:", err);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // serialize filters for deep comparison

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    data,
    loading,
    totalCount,
    refetch: fetchTrips,
  };
}

export function useCatalogTripDetail(id: string | number) {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getCatalogTripDetail(id);
      setTrip(res);
    } catch (err) {
      console.error("Failed to fetch trip detail:", err);
      setTrip(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return {
    trip,
    loading,
    refetch: fetchTrip,
  };
}

export function useCatalogFilters() {
  const [categories, setCategories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFilters = useCallback(async () => {
    setLoading(true);
    try {
      let catResults: any[] = [];
      let destResults: any[] = [];
      let page = 1;
      let hasMoreCat = true;
      let hasMoreDest = true;

      while (hasMoreCat || hasMoreDest) {
        const [catRes, destRes] = await Promise.all([
          hasMoreCat ? getCategories({ page_size: 100, page }) : Promise.resolve({ results: [], next: null }),
          hasMoreDest ? getDestinations({ page_size: 100, page }) : Promise.resolve({ results: [], next: null })
        ]);

        const cats = catRes.results || catRes || [];
        const dests = destRes.results || destRes || [];
        
        catResults = [...catResults, ...(Array.isArray(cats) ? cats : [])];
        destResults = [...destResults, ...(Array.isArray(dests) ? dests : [])];

        if (!catRes.next || (Array.isArray(cats) && cats.length < 10)) hasMoreCat = false;
        if (!destRes.next || (Array.isArray(dests) && dests.length < 10)) hasMoreDest = false;
        
        page++;
      }

      setCategories(catResults);
      setDestinations(destResults);
    } catch (err) {
      console.error("Failed to fetch filters:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return {
    categories,
    destinations,
    loading,
  };
}

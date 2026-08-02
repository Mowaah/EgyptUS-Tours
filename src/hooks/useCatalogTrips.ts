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
      const res = await getCatalogTrips(filters);
      setData(res.results || []);
      setTotalCount(res.count || 0);
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
      const [catRes, destRes] = await Promise.all([
        getCategories(),
        getDestinations()
      ]);
      setCategories(catRes.results || catRes || []);
      setDestinations(destRes.results || destRes || []);
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

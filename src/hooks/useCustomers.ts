import useSWR from 'swr';
import {
  getCustomers,
  getCustomerStats,
  getCustomer,
  getCustomerOverview,
  getCustomerBookings,
  getCustomerRequests,
  getCustomerReviews,
} from '@/services/admin/adminCustomersService';
import type { AdminCustomerFilters } from '@/types/adminCustomerTypes';

export function useAdminCustomers(filters?: AdminCustomerFilters) {
  const { data, error, isLoading, mutate } = useSWR(
    ['adminCustomers', filters],
    () => getCustomers(filters)
  );

  return {
    customers: data,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}

export function useAdminCustomerStats() {
  const { data, error, isLoading, mutate } = useSWR(
    'adminCustomerStats',
    () => getCustomerStats()
  );

  return {
    stats: data,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}

export function useAdminCustomer(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['adminCustomer', id] : null,
    () => getCustomer(id)
  );

  return {
    customer: data,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}

export function useAdminCustomerOverview(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['adminCustomerOverview', id] : null,
    () => getCustomerOverview(id)
  );

  return {
    overview: data,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}

export function useAdminCustomerBookings(id: string, page = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['adminCustomerBookings', id, page] : null,
    () => getCustomerBookings(id, page)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}

export function useAdminCustomerRequests(id: string, page = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['adminCustomerRequests', id, page] : null,
    () => getCustomerRequests(id, page)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}

export function useAdminCustomerReviews(id: string, page = 1) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['adminCustomerReviews', id, page] : null,
    () => getCustomerReviews(id, page)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}

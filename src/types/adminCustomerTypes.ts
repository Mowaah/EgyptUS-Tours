export interface AdminCustomer {
  id: string | number;
  full_name: string;
  email: string;
  phone: string;
  nationality: string | null;
  status: "active" | "inactive" | "blocked";
  is_vip: boolean;
  created_at: string;
  bookings_count: number;
  total_spent: string | number;
  last_activity_at: string | null;
  avatar_url?: string; // Add if available
}

export interface AdminCustomerStats {
  range: string;
  total: number;
  vip: number;
  active: number;
  inactive: number;
  blocked: number;
  new_this_week?: number;
  trends: {
    total: string;
    vip: string;
    active: string;
    inactive: string;
    blocked: string;
  };
}

export interface AdminCustomerOverview {
  display_id: string;
  bookings_count: number;
  requests_count: number;
  reviews_count: number;
  total_spent_by_currency: Record<string, string | number>;
  last_activity_at: string | null;
  service_breakdown: Record<string, number>;
  destinations_breakdown: Record<string, number>;
}

export interface AdminCustomerFilters {
  search?: string;
  status?: string;
  nationality?: string;
  is_vip?: boolean;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface AdminCustomerListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminCustomer[];
}

export interface PaginatedTabResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

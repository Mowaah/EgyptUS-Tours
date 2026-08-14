import { adminDataClient } from "@/lib/adminCoreApi";

export interface TopDestination {
  destination: string;
  booking_count?: number;
  total_revenue?: string;
}

export interface BookingsByService {
  trip?: number | string;
  hotel?: number | string;
  transport?: number | string;
  custom_trip?: number | string;
  mice?: number | string;
  b2b?: number | string;
}

export interface HotelOccupancy {
  hotel_id: number;
  hotel_name: string;
  booked_room_nights: number;
  available_room_nights: number;
  approximate_occupancy_pct: string;
}

export interface FleetUtilization {
  vehicle_type: string;
  total_vehicles: number;
  active_vehicles: number;
  utilization_pct: string;
}

export interface OperationalReportsPayload {
  range: string;
  date_from: string;
  date_to: string;
  tab: string;
  top_destinations: TopDestination[];
  bookings_by_service: BookingsByService;
  hotel_occupancy: HotelOccupancy[];
  fleet_utilization: FleetUtilization[];
}

export interface SalesKpiData {
  value: number | string;
  trend_pct: string;
  series: { date: string; value: number | string }[];
}

export interface SalesKpis {
  total_bookings: SalesKpiData;
  total_revenue: SalesKpiData;
  avg_booking_value: SalesKpiData;
}

export interface LeadsKpis {
  total_leads: SalesKpiData;
  converted: SalesKpiData;
  lost: SalesKpiData;
  conversion_rate: SalesKpiData;
}

export interface RevenueByPartner {
  partner: string;
  total_revenue: string;
}

export interface SalesReportsPayload {
  range: string;
  date_from: string;
  date_to: string;
  tab: string;
  kpis: SalesKpis;
  revenue_by_destination: TopDestination[]; // using the same but with total_revenue instead of booking_count. Actually I will redefine it inline or make TopDestination generic.
  revenue_by_service: BookingsByService; // It has the same keys, but values are string.
  revenue_by_partner: RevenueByPartner[];
}

export interface LeadsReportsPayload {
  range: string;
  date_from: string;
  date_to: string;
  tab: string;
  kpis: LeadsKpis;
}

export interface NewVsReturningSeries {
  date: string;
  new: number;
  returning: number;
}

export interface CustomersByNationality {
  nationality: string;
  customer_count: number;
}

export interface TopCustomer {
  customer_name: string;
  email: string;
  total_revenue: string;
}

export interface CustomerReportsPayload {
  range: string;
  date_from: string;
  date_to: string;
  tab: string;
  new_vs_returning: {
    rule: string;
    series: NewVsReturningSeries[];
  };
  customers_by_nationality: CustomersByNationality[];
  top_customers: {
    count: number;
    next: string | null;
    previous: string | null;
    results: TopCustomer[];
  };
}

export interface MiceProposal {
  id: number;
  organization_name: string;
  contact_person: string;
  preferred_city: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  display_status?: string;
  event_type: string;
  estimated_budget_range: string;
  created_at: string;
}

export interface MiceReportsPayload {
  range: string;
  date_from: string;
  date_to: string;
  tab: string;
  approximation_note: string;
  kpis: {
    rfps_received: SalesKpiData;
    proposals_sent: SalesKpiData;
    contracts_signed: SalesKpiData;
  };
  pipeline: {
    stage: string;
    label: string;
    count: number;
  }[];
  revenue_by_event_type: {
    unavailable: boolean;
    reason: string;
    fallback?: {
      by_event_type_count: { event_type: string; proposal_count: number }[];
    };
  };
  proposals_detail: {
    count: number;
    next: string | null;
    previous: string | null;
    results: MiceProposal[];
  };
}

export async function fetchOperationalReports(params?: { range?: string; date_from?: string; date_to?: string }): Promise<OperationalReportsPayload> {
  return await adminDataClient.get("/reports/operational/", { params });
}

export async function fetchSalesReports(params?: { range?: string; date_from?: string; date_to?: string }): Promise<SalesReportsPayload> {
  return await adminDataClient.get("/reports/sales/", { params });
}

export async function fetchLeadsReports(params?: { range?: string; date_from?: string; date_to?: string }): Promise<LeadsReportsPayload> {
  return await adminDataClient.get("/reports/leads/", { params });
}

export async function fetchCustomerReports(params?: { range?: string; date_from?: string; date_to?: string }): Promise<CustomerReportsPayload> {
  return await adminDataClient.get("/reports/customers/", { params });
}

export async function fetchMiceReports(params?: { range?: string; date_from?: string; date_to?: string }): Promise<MiceReportsPayload> {
  return await adminDataClient.get("/reports/mice/", { params });
}

export async function downloadReportExport(tab: string, section: string, params?: { range?: string; date_from?: string; date_to?: string; export_format?: string }) {
  const response = await adminDataClient.get(`/reports/${tab}/export/`, {
    params: { section, export_format: "csv", ...params },
    responseType: "blob",
  });
  
  // Create a blob URL and trigger download
  const url = window.URL.createObjectURL(new Blob([response as any]));
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${tab}_${section}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

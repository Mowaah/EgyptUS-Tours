import { adminDataClient } from "@/lib/adminCoreApi";

export interface TopDestination {
  destination: string;
  booking_count: number;
}

export interface BookingsByService {
  trip: number;
  hotel: number;
  transport: number;
  mice: number;
  b2b: number;
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

export async function fetchOperationalReports(params?: { range?: string; date_from?: string; date_to?: string }): Promise<OperationalReportsPayload> {
  return await adminDataClient.get("/reports/operational/", { params });
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

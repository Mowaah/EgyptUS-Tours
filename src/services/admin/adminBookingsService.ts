import { adminDataClient } from "@/lib/adminCoreApi";

export interface BookingQuery {
  page?: number;
  page_size?: number;
  search?: string;
  source?: string;
  status?: string;
  tour_type?: string;
  vehicle_class?: string;
  trip_type?: string;
  payment_status?: string;
}

export async function getTripBookings(query?: BookingQuery): Promise<any> {
  return await adminDataClient.get('/bookings/trips/', { params: query });
}

export async function getTripBookingById(id: string | number): Promise<any> {
  return await adminDataClient.get(`/bookings/trips/${id}/`);
}

export async function getTransportationBookings(query?: BookingQuery): Promise<any> {
  return await adminDataClient.get('/bookings/transportation/', { params: query });
}

export async function getTransportationBookingById(id: string | number): Promise<any> {
  return await adminDataClient.get(`/bookings/transportation/${id}/`);
}

export async function getHotelBookings(query?: BookingQuery): Promise<any> {
  return await adminDataClient.get('/bookings/hotels/', { params: query });
}

export async function getHotelBookingById(id: string | number): Promise<any> {
  return await adminDataClient.get(`/bookings/hotels/${id}/`);
}

export async function getTripStats(range: string = "30d"): Promise<any> {
  return await adminDataClient.get('/bookings/trips/stats/', { params: { range } });
}

export async function getTransportationStats(range: string = "30d"): Promise<any> {
  return await adminDataClient.get('/bookings/transportation/stats/', { params: { range } });
}

export async function getHotelStats(range: string = "30d"): Promise<any> {
  return await adminDataClient.get('/bookings/hotels/stats/', { params: { range } });
}

export async function reassignBooking(type: 'trips' | 'transportation' | 'hotels', id: string | number, agentId: string | number): Promise<any> {
  return await adminDataClient.post(`/bookings/${type}/${id}/reassign/`, { assignee_id: agentId });
}

export async function cancelTripBooking(id: string | number, reason: string): Promise<any> {
  return await adminDataClient.post(`/bookings/trips/${id}/cancel/`, { cancellation_reason: reason });
}

export async function cancelTransportationBooking(id: string | number, reason: string): Promise<any> {
  return await adminDataClient.post(`/bookings/transportation/${id}/cancel/`, { cancellation_reason: reason });
}

export async function cancelHotelBooking(id: string | number, reason: string): Promise<any> {
  return await adminDataClient.post(`/bookings/hotels/${id}/cancel/`, { cancellation_reason: reason });
}

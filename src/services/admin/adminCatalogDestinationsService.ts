import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

import { fileToBase64 } from '@/utils/imageUtils';

async function buildDestinationPayload(data: { translations?: Record<string, { name: string }>; image?: File }) {
  const payload: { translations?: Record<string, { name: string }>; name?: string; image?: string } = {};
  if (data.translations !== undefined) {
    payload.translations = data.translations;
    payload.name = data.translations.en?.name;
  }
  if (data.image) payload.image = await fileToBase64(data.image);
  return payload;
}

export async function getDestinations(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/destinations/', { params });
}

export async function createDestination(data: { translations: Record<string, { name: string }>; image?: File }): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/destinations/', await buildDestinationPayload(data));
}

export async function updateDestination(id: string | number, data: { translations?: Record<string, { name: string }>; image?: File }): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/destinations/${id}/`, await buildDestinationPayload(data));
}

export async function deleteDestination(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/destinations/${id}/`);
}

import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function buildDestinationPayload(data: { name?: string; image?: File }) {
  const payload: { name?: string; image?: string } = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.image) payload.image = await fileToDataUrl(data.image);
  return payload;
}

export async function getDestinations(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/destinations/', { params });
}

export async function createDestination(data: { name: string; image?: File }): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/destinations/', await buildDestinationPayload(data));
}

export async function updateDestination(id: string | number, data: { name?: string; image?: File }): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/destinations/${id}/`, await buildDestinationPayload(data));
}

export async function deleteDestination(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/destinations/${id}/`);
}

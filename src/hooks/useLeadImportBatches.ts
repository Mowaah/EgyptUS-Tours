import useSWR, { mutate as globalMutate } from "swr";
import {
  fetchAdminLeadImportBatches,
  getAdminLeadImportBatch,
  createAdminLeadImportBatch,
  deleteAdminLeadImportBatch,
  reassignAdminLeadImportBatch,
} from "@/services/admin/adminLeadsService";
import type { AdminLeadImportBatch } from "@/types/adminLeadTypes";

export function useLeadImportBatches(params?: any) {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    ["adminLeadImportBatches", params],
    () => fetchAdminLeadImportBatches(params)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch,
  };
}

export function useLeadImportBatch(id: number) {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    id ? ["adminLeadImportBatch", id] : null,
    () => getAdminLeadImportBatch(id)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch,
  };
}

export function useCreateLeadImportBatch() {
  return {
    mutate: async ({ file, assignees }: { file: File, assignees: number[] }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await createAdminLeadImportBatch(file, assignees);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeadImportBatches", undefined, { revalidate: true });
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useDeleteLeadImportBatch() {
  return {
    mutate: async (id: number, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        await deleteAdminLeadImportBatch(id);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeadImportBatches", undefined, { revalidate: true });
        options?.onSuccess?.(null);
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useReassignLeadImportBatch() {
  return {
    mutate: async ({ id, memberId }: { id: number; memberId: number }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await reassignAdminLeadImportBatch(id, memberId);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeadImportBatches", undefined, { revalidate: true });
        globalMutate(["adminLeadImportBatch", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

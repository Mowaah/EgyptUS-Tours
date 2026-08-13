import useSWR, { mutate as globalMutate } from "swr";
import {
  fetchAdminLeads,
  exportAdminLeads,
  getAdminLead,
  createAdminLead,
  updateAdminLead,
  assignAdminLead,
  closeAdminLead,
  reopenAdminLead,
  markAdminLeadContacted,
  markAdminLeadQualified,
  getAdminLeadTimeline,
  addAdminLeadNote,
  getAdminLeadStats,
  convertAdminLead,
} from "@/services/admin/adminLeadsService";
import type { 
  AdminLeadCreatePayload, 
  AdminLeadUpdatePayload 
} from "@/types/adminLeadTypes";

export function useExportLeads() {
  return {
    mutate: async (params?: any, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
      try {
        const blob = await exportAdminLeads(params);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "leads.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useLeads(params?: any) {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    ["adminLeads", params],
    () => fetchAdminLeads(params)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch,
  };
}

export function useLead(id: number) {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    id ? ["adminLead", id] : null,
    () => getAdminLead(id)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch,
  };
}

export function useLeadTimeline(id: number) {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    id ? ["adminLeadTimeline", id] : null,
    () => getAdminLeadTimeline(id)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch,
  };
}

export function useLeadStats() {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    "adminLeadStats",
    () => getAdminLeadStats()
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch,
  };
}

// Mutations wrapped in standard async functions
export function useCreateLead() {
  return {
    mutate: async (payload: AdminLeadCreatePayload, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await createAdminLead(payload);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate("adminLeadStats");
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useUpdateLead() {
  return {
    mutate: async ({ id, payload }: { id: number; payload: AdminLeadUpdatePayload }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await updateAdminLead(id, payload);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate(["adminLead", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useAssignLead() {
  return {
    mutate: async ({ id, userId }: { id: number; userId: number }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await assignAdminLead(id, userId);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate(["adminLead", id]);
        globalMutate(["adminLeadTimeline", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useCloseLead() {
  return {
    mutate: async ({ id, reason }: { id: number; reason: string }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await closeAdminLead(id, reason);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate(["adminLead", id]);
        globalMutate(["adminLeadTimeline", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useReopenLead() {
  return {
    mutate: async ({ id, reason }: { id: number; reason: string }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await reopenAdminLead(id, reason);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate(["adminLead", id]);
        globalMutate(["adminLeadTimeline", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useMarkLeadContacted() {
  return {
    mutate: async ({ id, note }: { id: number; note: string }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await markAdminLeadContacted(id, note);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate(["adminLead", id]);
        globalMutate(["adminLeadTimeline", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useMarkLeadQualified() {
  return {
    mutate: async ({ id, note }: { id: number; note: string }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await markAdminLeadQualified(id, note);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate(["adminLead", id]);
        globalMutate(["adminLeadTimeline", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useAddLeadNote() {
  return {
    mutate: async ({ id, note }: { id: number; note: string }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await addAdminLeadNote(id, note);
        globalMutate(["adminLeadTimeline", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

export function useConvertLead() {
  return {
    mutate: async ({ id, note }: { id: number; note: string }, options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) => {
      try {
        const result = await convertAdminLead(id, note);
        globalMutate((key: any) => Array.isArray(key) && key[0] === "adminLeads", undefined, { revalidate: true });
        globalMutate(["adminLead", id]);
        globalMutate(["adminLeadTimeline", id]);
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        options?.onError?.(error);
        throw error;
      }
    },
  };
}

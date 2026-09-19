import useSWR from "swr";
import { getAdminRoles } from "@/services/admin/adminUsersService";
import type { AdminRoleRow } from "@/components/dashboard/UserManagement/types";

export function useAdminRoles() {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    "/admin/roles/",
    () => getAdminRoles()
  );

  const raw = data?.results || (Array.isArray(data) ? data : []);
  const roles: AdminRoleRow[] = Array.isArray(raw) ? raw : [];

  return {
    data,
    roles,
    isLoading,
    isError: !!error,
    refetch,
  };
}

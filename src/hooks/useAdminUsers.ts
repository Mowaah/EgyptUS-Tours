import useSWR from "swr";
import { getAdminUsers } from "@/services/admin/adminUsersService";

export function useAdminUsers(params?: any) {
  const { data, error, isLoading, mutate: refetch } = useSWR(
    ["adminUsers", params],
    () => getAdminUsers(params)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    refetch,
  };
}

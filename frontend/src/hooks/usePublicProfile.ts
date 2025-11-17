import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";

export function usePublicProfile(userId: string | null) {
  const query = useQuery({
    queryKey: ['public-profile', userId],
    queryFn: () => userApi.getPublicProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
  };
}

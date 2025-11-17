import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";

export function useLikes() {
  const query = useQuery({
    queryKey: ['likes'],
    queryFn: () => userApi.getLikes(),
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

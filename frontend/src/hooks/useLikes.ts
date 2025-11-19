import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";
import { toast } from "sonner";
import { useEffect } from "react";

export function useLikes() {
  const query = useQuery({
    queryKey: ['likes'],
    queryFn: () => userApi.getLikes(),
    staleTime: 1000 * 60, // 1 minute
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

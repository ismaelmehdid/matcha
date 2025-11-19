import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";
import { toast } from "sonner";
import { useEffect } from "react";

export function useAllMatches() {
  const query = useQuery({
    queryKey: ['matches'],
    queryFn: userApi.findAllMatches,
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
    isSuccess: query.isSuccess,
  };
}
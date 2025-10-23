import { interestApi } from "@/api/interest/interest";
import { useQuery } from "@tanstack/react-query";

export function useInterests() {
  const query = useQuery({
    queryKey: ['interests'],
    queryFn: interestApi.findAll,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}

import { interestApi } from "@/api/interest/interest";
import { useQuery } from "@tanstack/react-query";
import { transformToInterests } from "@/lib/transformers";

export function useInterests() {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['interests'],
    queryFn: async () => {
      const response = await interestApi.findAll();
      return transformToInterests(response);
    },
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
  };
}

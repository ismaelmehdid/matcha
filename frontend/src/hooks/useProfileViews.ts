import { useQuery } from "@tanstack/react-query";
import { profileViewApi } from "@/api/profile-view/profile-view";
import { toast } from "sonner";
import { useEffect } from "react";

export function useProfileViews() {
  const query = useQuery({
    queryKey: ['profile-views'],
    queryFn: profileViewApi.getProfileViews,
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

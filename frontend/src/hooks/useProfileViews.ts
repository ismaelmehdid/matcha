import { useQuery } from "@tanstack/react-query";
import { profileViewApi } from "@/api/profile-view/profile-view";

export function useProfileViews() {
  const query = useQuery({
    queryKey: ['profile-views'],
    queryFn: profileViewApi.getProfileViews,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}

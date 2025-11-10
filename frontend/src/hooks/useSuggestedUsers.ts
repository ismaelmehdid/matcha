import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";
import { type Filters } from "./useUsers";

export function useSuggestedUsers(params?: Filters) {
  let cities: string[] = [];
  let countries: string[] = [];
  for (const location of params?.locations || []) {
    const parts = location.split(',').map(p => p.trim());
    cities.push(parts[0] || '');
    countries.push(parts[1] || '');
  }

  const query = useQuery({
    queryKey: ['suggestedUsers', params],
    queryFn: () => {
      return userApi.getSuggestedUsers({
        minAge: params?.minAge,
        maxAge: params?.maxAge,
        minFame: params?.minFame,
        maxFame: params?.maxFame,
        cities: cities.length > 0 ? cities : undefined,
        countries: countries.length > 0 ? countries : undefined,
        tags: params?.tags && params.tags.length > 0 ? params.tags : undefined,
        firstName: params?.firstName,
        sort: params?.sort,
      });
    },
  });

  return {
    users: query.data?.users ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}


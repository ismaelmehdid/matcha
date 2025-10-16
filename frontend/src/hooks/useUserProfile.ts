import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user/user';
import type { GetOwnProfileResponse, UpdateProfileRequest } from '../api/user/schema';
import type { EmptyResponse } from '../api/schema';

export function useCurrentUser() {
  return useQuery<GetOwnProfileResponse>({
    queryKey: ['user'],
    queryFn: userApi.getOwnProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<EmptyResponse, Error, UpdateProfileRequest>({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

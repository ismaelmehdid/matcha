import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user/user';
import { toast } from 'sonner';
import { type SexualOrientation, type Gender } from '@/types/user';
import type { UpdateProfileRequest } from '@/api/user/schema';

// TODO: change query key to 'user' when backend is ready
// (temporary 'v2' key to avoid conflicts with old implementation)
export function useCurrentUser() {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getOwnProfile,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<EmptyResponse, EmptyErrorResponse, UpdateProfileRequest>({
    mutationFn: userApi.updateProfile,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['user', 'v2'] });
        toast.success(getToastMessage(response.messageKey));
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user/user';
import type { UpdateProfileRequest } from '../api/user/schema';
import type { EmptyResponse, EmptyErrorResponse } from '../api/schema';
import { toast } from 'sonner';
import { getToastMessage } from '@/lib/messageMap';
import { transformToUser } from '@/lib/transformers';
import type { User } from '@/types/user';

export function useCurrentUser() {
  const query = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await userApi.getOwnProfile();
      return transformToUser(response);
    },
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
        queryClient.invalidateQueries({ queryKey: ['user'] });
        toast.success(getToastMessage(response.messageKey));
      }
    },
    onError: (response) => {
      toast.error(getToastMessage(response.messageKey));
    },
  });
}

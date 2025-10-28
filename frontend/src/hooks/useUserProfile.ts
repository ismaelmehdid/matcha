import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user/user';
import { toast } from 'sonner';
import type { User } from '@/types/user';

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

export function useCompleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.completeProfile,
    onSuccess: (user: User) => {
      queryClient.setQueryData(['user'], user);
      toast.success('Profile completed successfully! 🎉');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (user: User) => {
      queryClient.setQueryData(['user'], user);
      toast.success('Profile updated successfully 🎉');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

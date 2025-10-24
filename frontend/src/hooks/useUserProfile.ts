import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user/user';
import { toast } from 'sonner';
import type { User } from '@/types/user';

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
  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (user: User) => {
      queryClient.setQueryData(['user', 'v2'], user);
      toast.success('Profile updated successfully 🎉');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

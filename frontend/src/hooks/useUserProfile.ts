import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user/user';
import { toast } from 'sonner';
import type { User } from '@/types/user';
import { getToastMessage } from '@/lib/messageMap';
import { useEffect } from 'react';

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getOwnProfile,
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

export function useCompleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.completeProfile,
    onSuccess: async ({ data, messageKey }: { data: User; messageKey: string }) => {
      queryClient.setQueryData(['user'], data);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(getToastMessage(messageKey));
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
    onSuccess: async ({ messageKey }: { messageKey: string; emailChanged?: boolean }) => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(getToastMessage(messageKey));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

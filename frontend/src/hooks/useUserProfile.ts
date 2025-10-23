import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user/user';
import { toast } from 'sonner';
import { type SexualOrientation, type Gender } from '@/types/user';

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
  return useMutation<void, Error, { firstName: string, lastName: string, gender: Gender, sexualOrientation: SexualOrientation, biography: string, latitude: number, longitude: number }>({
    mutationFn: ({ firstName, lastName, gender, sexualOrientation, biography, latitude, longitude }) => userApi.updateProfile(firstName, lastName, gender, sexualOrientation, biography, latitude, longitude),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile updated successfully 🎉');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

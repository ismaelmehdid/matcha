import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";

export function useUnlikeUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => userApi.unlikeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes-sent'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile'] });
    },
  });

  return {
    unlikeUser: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

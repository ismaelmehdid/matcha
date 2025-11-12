import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";

export function useUnlikeUser() {
  const mutation = useMutation({
    mutationFn: (userId: string) => userApi.unlikeUser(userId),
  });

  return {
    unlikeUser: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

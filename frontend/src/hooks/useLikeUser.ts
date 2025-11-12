import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";

export function useLikeUser() {
  const mutation = useMutation({
    mutationFn: (userId: string) => userApi.likeUser(userId),
  });

  return {
    likeUser: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

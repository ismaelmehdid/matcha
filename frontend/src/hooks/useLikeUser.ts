import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";
import { toast } from "sonner";

export function useLikeUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => userApi.likeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes-sent'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    likeUser: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

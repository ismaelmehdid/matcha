import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export function useVerifyEmail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const verifyEmailMutation = useMutation({
    mutationFn: (verifyEmailToken: string) => authApi.verifyEmail(verifyEmailToken),
    onSuccess: async () => {
      toast.success('Email verified successfully 🎉');
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyEmail = useCallback((verifyEmailToken: string) => {
    verifyEmailMutation.mutate(verifyEmailToken);
  }, [verifyEmailMutation]);

  return {
    verifyEmail,
    isSuccess: verifyEmailMutation.isSuccess,
    isError: verifyEmailMutation.isError,
    isPending: verifyEmailMutation.isPending,
  };
}
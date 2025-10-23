import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string, password: string }) => authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password reset successfully 🎉');
      navigate("/auth/sign-in");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetPassword = (token: string, password: string) => {
    resetPasswordMutation.mutate({ token, password });
  };

  return {
    resetPassword,
    isPending: resetPasswordMutation.isPending,
    isError: resetPasswordMutation.isError,
    isSuccess: resetPasswordMutation.isSuccess,
  };
}

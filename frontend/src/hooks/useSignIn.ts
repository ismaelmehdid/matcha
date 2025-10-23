import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { AccessToken } from "@/types/user";

export function useSignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const signInMutation = useMutation<AccessToken, Error, { username: string, password: string }>({
    mutationFn: ({ username, password }) => authApi.signIn(username, password),
    onSuccess: (accessToken: AccessToken) => {
      signIn(accessToken.accessToken);
      toast.success('Signed in successfully 🎉');
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signInUser = ({ username, password }: { username: string, password: string }) => {
    signInMutation.mutate({ username, password });
  };

  return {
    signInUser,
    isPending: signInMutation.isPending,
    isError: signInMutation.isError,
    isSuccess: signInMutation.isSuccess,
    data: signInMutation.data,
  };
}

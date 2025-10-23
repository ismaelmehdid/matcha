import { authApi } from "@/api/auth/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { AccessToken } from "@/types/user";

export function useSignUp() {
  const { signIn } = useAuth();

  const signUpMutation = useMutation({
    mutationFn: ({ email, password, firstName, lastName, username }: { email: string, password: string, firstName: string, lastName: string, username: string }) => authApi.signUp(email, password, firstName, lastName, username),
    onSuccess: (accessToken: AccessToken) => {
      signIn(accessToken.accessToken);
      toast.success('Signed up successfully 🎉');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signUp = ({ email, password, firstName, lastName, username }: { email: string, password: string, firstName: string, lastName: string, username: string }) => {
    signUpMutation.mutate({ email, password, firstName, lastName, username });
  };

  return {
    signUp,
    isPending: signUpMutation.isPending,
    isError: signUpMutation.isError,
    isSuccess: signUpMutation.isSuccess,
  };
}
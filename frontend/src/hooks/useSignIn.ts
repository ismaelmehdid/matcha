import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { type SignInRequest } from "@/api/auth/schema";
import { type EmptyErrorResponse } from "@/api/schema";
import { getToastMessage } from "@/lib/messageMap";
import { transformToAuthToken } from "@/lib/transformers";
import type { AuthToken } from "@/types/user";

export function useSignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const signInMutation = useMutation<AuthToken, EmptyErrorResponse, SignInRequest>({
    mutationFn: async (request: SignInRequest) => {
      const response = await authApi.signIn(request);
      const authToken = transformToAuthToken(response);
      if (!authToken) {
        throw new Error('Failed to transform sign in response');
      }
      return authToken;
    },
    onSuccess: (authToken: AuthToken) => {
      signIn(authToken.accessToken);
      toast.success("Successfully signed in");
      navigate("/");
    },
    onError: (response: EmptyErrorResponse) => {
      toast.error(getToastMessage(response.messageKey));
    },
  });

  const signInUser = (request: SignInRequest) => {
    signInMutation.mutate(request);
  };

  return {
    signInUser,
    isPending: signInMutation.isPending,
    isError: signInMutation.isError,
    isSuccess: signInMutation.isSuccess,
    data: signInMutation.data, // Now returns AuthToken domain type
  };
}

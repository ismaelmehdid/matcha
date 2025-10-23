import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth/auth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function useForgotPassword() {
  const [isSentButtonDisabled, setIsSentButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.sendPasswordResetEmail(email),
    onSuccess: () => {
      toast.success('Password reset email sent successfully 🎉');
      setIsSentButtonDisabled(true);
      setTimeLeft(60);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendPasswordResetEmail = (email: string) => {
    forgotPasswordMutation.mutate(email);
  };

  // Timer effect for resend button
  useEffect(() => {
    if (isSentButtonDisabled && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsSentButtonDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSentButtonDisabled, timeLeft]);

  return {
    sendPasswordResetEmail,
    isPending: forgotPasswordMutation.isPending,
    isError: forgotPasswordMutation.isError,
    isSuccess: forgotPasswordMutation.isSuccess,
    isSentButtonDisabled,
    timeLeft,
  };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth/auth';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export function useSendVerifyEmail() {
  const queryClient = useQueryClient();
  const [isSentButtonDisabled, setIsSentButtonDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const sendVerifyEmailMutation = useMutation({
    mutationFn: authApi.sendVerifyEmail,
    onSuccess: () => {
      toast.success("Verification email sent");
      setIsSentButtonDisabled(true);
      setTimeLeft(60);
      // Invalidate user query to refresh email verification status
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(`Failed to send verification email: ${error.message}`);
    },
  });

  // Timer effect for resend cooldown
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

  const sendVerifyEmail = (email: string) => {
    sendVerifyEmailMutation.mutate({ email });
  };

  return {
    sendVerifyEmail,
    isPending: sendVerifyEmailMutation.isPending,
    isSentButtonDisabled,
    timeLeft,
  };
}

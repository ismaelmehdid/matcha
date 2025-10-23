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
      setIsSentButtonDisabled(true);
      setTimeLeft(60);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success('Verify email sent successfully 🎉');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const sendVerifyEmail = () => {
    sendVerifyEmailMutation.mutate();
  };

  return {
    sendVerifyEmail,
    isPending: sendVerifyEmailMutation.isPending,
    isSentButtonDisabled,
    timeLeft,
  };
}

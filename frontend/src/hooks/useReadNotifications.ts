import { useMutation } from "@tanstack/react-query";
import { notificationApi } from "@/api/notification/notification";
import { toast } from "sonner";

export function useReadNotifications() {
  const { mutate: readNotifications, isPending, isError, isSuccess } = useMutation({
    mutationFn: notificationApi.readNotifications,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    readNotifications,
    isPending,
    isError,
    isSuccess,
  };
}
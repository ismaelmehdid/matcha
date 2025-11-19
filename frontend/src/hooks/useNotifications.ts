import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/api/notification/notification";
import { toast } from "sonner";
import { useEffect } from "react";

export function useNotifications() {
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.findAllNotifications,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
    }
  }, [query.isError, query.error]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
}
import { useQuery } from "@tanstack/react-query";
import { messageApi } from "@/api/message/message";
import { toast } from "sonner";
import { useEffect } from "react";

export function useMessages(chatId: string) {
  const query = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messageApi.findAllByChatId(chatId),
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
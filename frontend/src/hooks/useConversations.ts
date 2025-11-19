import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat/chat";
import { toast } from "sonner";
import { useEffect } from "react";

export function useConversations() {
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: chatApi.findAllConversations,
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

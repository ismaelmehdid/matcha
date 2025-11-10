import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";

export function useLikeUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => userApi.likeUser(userId),
    onMutate: async (userId) => {
      const previousUsersQueries = queryClient.getQueriesData({ queryKey: ['users'] });
      const previousSuggestedQueries = queryClient.getQueriesData({ queryKey: ['suggestedUsers'] });

      previousUsersQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === 'object' && 'pages' in data && Array.isArray((data as any).pages)) {
          const queryData = data as { pages: Array<{ users: Array<{ id: string; liked?: boolean }> }> };
          const newPages = queryData.pages.map((page) => {
            const user = page.users.find(u => u.id === userId);
            if (!user || user.liked === true) return page;

            return {
              ...page,
              users: page.users.map((u) => u.id === userId ? { ...u, liked: true } : u),
            };
          });

          const hasChanges = newPages.some((newPage, i) => newPage !== queryData.pages[i]);
          if (hasChanges) {
            queryClient.setQueryData(queryKey, { ...queryData, pages: newPages });
          }
        }
      });

      previousSuggestedQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === 'object' && 'users' in data && !('pages' in data) && Array.isArray((data as any).users)) {
          const queryData = data as { users: Array<{ id: string; liked?: boolean }> };
          const newUsers = queryData.users.map((u) => {
            if (u.id === userId && u.liked !== true) {
              return { ...u, liked: true };
            }
            return u;
          });

          const hasChanges = newUsers.some((newUser, i) => newUser !== queryData.users[i]);
          if (hasChanges) {
            queryClient.setQueryData(queryKey, { ...queryData, users: newUsers });
          }
        }
      });

      return { previousUsersQueries, previousSuggestedQueries };
    },
    onError: (_err, _userId, ctx) => {
      if (ctx?.previousUsersQueries) {
        ctx.previousUsersQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (ctx?.previousSuggestedQueries) {
        ctx.previousSuggestedQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });

  return {
    likeUser: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

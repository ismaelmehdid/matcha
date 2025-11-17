import { useMutation } from "@tanstack/react-query";
import { profileViewApi } from "@/api/profile-view/profile-view";

export function useRecordProfileView() {
  return useMutation({
    mutationFn: (userId: string) => profileViewApi.recordProfileView(userId),
    retry: false,
    // Silent - we don't show toast for recording views
  });
}

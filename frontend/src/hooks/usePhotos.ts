import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/user/user";
import { toast } from "sonner";

export interface Photo {
  id: string;
  url: string;
  isProfilePic: boolean;
  createdAt: string;
}

/**
 * Hook for fetching user photos
 */
export function useUserPhotos() {
  return useQuery<Photo[]>({
    queryKey: ['user', 'photos'],
    queryFn: userApi.getUserPhotos,
  });
}

/**
 * Hook for uploading photos
 */
export function useUploadPhotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => userApi.uploadPhotos(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'photos'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success("Photos uploaded successfully", {
        id: 'photo-upload', // Prevent toast spam when uploading multiple photos
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to upload photos";
      toast.error(errorMessage, {
        id: 'photo-upload', // Use same ID to replace success toast if error occurs
      });
    },
  });
}

/**
 * Hook for deleting a photo
 */
export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => userApi.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'photos'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success("Photo deleted successfully", {
        id: 'photo-delete', // Prevent toast spam when deleting multiple photos
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete photo";
      toast.error(errorMessage, {
        id: 'photo-delete', // Use same ID to replace success toast if error occurs
      });
    },
  });
}

/**
 * Hook for setting profile picture
 */
export function useSetProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => userApi.setProfilePicture(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'photos'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success("Profile picture updated successfully", {
        id: 'profile-picture-update', // Prevent toast spam when rapidly changing profile picture
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to set profile picture";
      toast.error(errorMessage, {
        id: 'profile-picture-update', // Use same ID to replace success toast if error occurs
      });
    },
  });
}

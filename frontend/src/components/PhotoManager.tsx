import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Camera, XIcon, Star } from 'lucide-react';
import { useUserPhotos, useUploadPhotos, useDeletePhoto, useSetProfilePicture, type Photo } from '@/hooks/usePhotos';
import { Skeleton } from './ui/skeleton';
import { getPhotoUrl } from '@/utils/photoUtils';
import { toast } from 'sonner';

interface PhotoSlotProps {
  photo?: Photo;
  onUpload: (file: File) => void;
  onDelete: () => void;
  onSetProfilePic: () => void;
  isUploading: boolean;
}

function PhotoSlot({ photo, onUpload, onDelete, onSetProfilePic, isUploading }: PhotoSlotProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File must be less than 5MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPEG and PNG files are supported');
        return;
      }

      onUpload(file);
    }
  };

  const photoUrl = photo ? getPhotoUrl(photo.url) : null;

  return (
    <div className="relative w-full aspect-square">
      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors relative overflow-hidden cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={!!photo || isUploading}
        />

        {photoUrl ? (
          <>
            <img
              src={photoUrl}
              alt="Uploaded photo"
              className="w-full h-full object-cover"
            />

            {/* Star button for profile picture selection */}
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetProfilePic();
              }}
              variant={photo.isProfilePic ? "default" : "secondary"}
              size="icon"
              className="absolute top-1 left-1 z-20 rounded-full w-8 h-8"
            >
              <Star
                size={16}
                fill={photo.isProfilePic ? "currentColor" : "none"}
              />
            </Button>

            {/* Delete button */}
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 z-20 rounded-full w-8 h-8"
            >
              <XIcon size={16} />
            </Button>
          </>
        ) : isUploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Camera className="w-6 h-6 text-gray-400" />
        )}
      </div>
    </div>
  );
}

export function PhotoManager() {
  const { data: photos = [], isLoading } = useUserPhotos();
  const uploadPhotos = useUploadPhotos();
  const deletePhoto = useDeletePhoto();
  const setProfilePicture = useSetProfilePicture();

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleUpload = async (file: File) => {
    if (photos.length >= 6) {
      toast.error('Maximum 6 photos allowed');
      return;
    }

    try {
      setUploadingIndex(photos.length);
      await uploadPhotos.mutateAsync([file]);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      await deletePhoto.mutateAsync(photoId);
    }
  };

  const handleSetProfilePic = async (photoId: string) => {
    await setProfilePicture.mutateAsync(photoId);
  };

  // Create array of 6 slots, filling with photos and null for empty slots
  const slots: (Photo | null)[] = [
    ...photos,
    ...Array(Math.max(0, 6 - photos.length)).fill(null)
  ].slice(0, 6);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {slots.map((photo, index) => (
          <PhotoSlot
            key={photo?.id || `empty-${index}`}
            photo={photo || undefined}
            onUpload={handleUpload}
            onDelete={() => photo && handleDelete(photo.id)}
            onSetProfilePic={() => photo && handleSetProfilePic(photo.id)}
            isUploading={uploadingIndex === index}
          />
        ))}
      </div>
      {photos.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          Click the star to set a photo as your profile picture
        </p>
      )}
    </div>
  );
}

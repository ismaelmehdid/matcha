import type { GetOwnProfileResponse } from '@/api/user/schema';
import type { SignInResponse } from '@/api/auth/schema';
import type { User, AuthToken } from '@/types/user';
import type { GetAllInterestsResponse } from '@/api/interest/schema';
import type { Interest } from '@/types/interest';

export function transformToUser(apiResponse: GetOwnProfileResponse): User | null {
  if (!apiResponse.success) {
    return null;
  }

  const { data } = apiResponse;

  return {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    sexualOrientation: data.sexualOrientation,
    biography: data.biography,
    fameRating: data.fameRating,
    latitude: data.latitude,
    longitude: data.longitude,
    email: data.email,
    isEmailVerified: data.isEmailVerified,
    createdAt: data.createdAt,
    lastTimeActive: data.lastTimeActive,
    photos: data.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      is_profile_pic: photo.is_profile_pic,
    })),
    interests: data.interests.map((interest) => ({
      id: interest.id,
      name: interest.name,
    })),
  };
}

export function transformToAuthToken(apiResponse: SignInResponse): AuthToken | null {
  if (!apiResponse.success) {
    return null;
  }

  return {
    accessToken: apiResponse.data.accessToken,
  };
}

export function transformToInterests(apiResponse: GetAllInterestsResponse): Interest[] {
  if (!apiResponse.success) {
    return [];
  }

  return apiResponse.data.map((interest: { id: number, name: string }) => ({
    id: interest.id,
    name: interest.name,
  }));
}

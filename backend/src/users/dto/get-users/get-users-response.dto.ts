import { UserInterestDto } from "../user.dto";

export class UserListItemDto {
  id: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  age: number;
  fameRating: number;
  cityName: string | null;
  countryName: string | null;
  interests: UserInterestDto[];
  liked: boolean;
}

export class GetUsersResponseDto {
  users: UserListItemDto[];
  nextCursor: string | null;
  hasMore: boolean;
}
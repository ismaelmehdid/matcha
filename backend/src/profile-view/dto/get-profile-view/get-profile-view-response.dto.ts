import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UserPreviewDto } from "src/users/dto/user-preview.dto";

export class ProfileViewItemDto {
  id: string;
  viewedAt: string;
  @ValidateNested()
  @Type(() => UserPreviewDto)
  viewer: UserPreviewDto;
}

export class GetProfileViewResponseDto {
  @ValidateNested({ each: true })
  @Type(() => ProfileViewItemDto)
  profileViews: ProfileViewItemDto[];
}

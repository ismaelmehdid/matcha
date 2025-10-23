import { IsString, MinLength, MaxLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { Gender, SexualOrientation } from '../enums/user.enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(SexualOrientation)
  sexualOrientation?: SexualOrientation;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  biography?: string;
}

import { IsEnum, IsString, MinLength, MaxLength, IsOptional, Matches, IsNumber, Min, Max, ValidateIf } from "class-validator";
import { Gender } from 'src/users/enums/user.enums';
import { SexualOrientation } from 'src/users/enums/user.enums';

export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must be less than 50 characters long' })
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: 'First name must contain only letters, spaces, hyphens, and apostrophes' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must be less than 50 characters long' })
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: 'Last name must contain only letters, spaces, hyphens, and apostrophes' })
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be a valid gender' })
  gender?: Gender;

  @IsOptional()
  @IsEnum(SexualOrientation, { message: 'Sexual orientation must be a valid sexual orientation' })
  sexualOrientation?: SexualOrientation;

  @IsOptional()
  @IsString({ message: 'Biography must be a string' })
  @MinLength(5, { message: 'Biography must be at least 5 characters long' })
  @MaxLength(500, { message: 'Biography must be less than 500 characters long' })
  biography?: string;

  @ValidateIf((o) => o.longitude !== undefined) // Can't receive only one of the two
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  @IsOptional()
  latitude?: number;

  @ValidateIf((o) => o.latitude !== undefined) // Can't receive only one of the two
  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  @IsOptional()
  longitude?: number;
}

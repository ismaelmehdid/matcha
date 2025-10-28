import { IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { Gender, SexualOrientation } from '../enums/user.enums';

export class CompleteProfileDto {
  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(SexualOrientation)
  sexualOrientation: SexualOrientation;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  biography: string;
}

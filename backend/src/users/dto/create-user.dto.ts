import { IsString, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9]+$/)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
  lastName: string;

  @IsString()
  @MinLength(12)
  password: string;
}

import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PrivateUserDto } from "../user.dto";

export class CompleteProfileResponseDto {
  @ValidateNested({ each: true })
  @Type(() => PrivateUserDto)
  user: PrivateUserDto;
}

import { Body, Controller, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';
import { UpdateProfileRequestDto, CompleteProfileRequestDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser('sub') userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new CustomHttpException('USER_NOT_FOUND', 'User not found', 'ERROR_USER_NOT_FOUND', HttpStatus.BAD_REQUEST);
    return { success: true, data: user, messageKey: 'SUCCESS_GET_CURRENT_USER' };
  }

  @Post('me/complete')
  @UseGuards(AuthGuard)
  async completeProfile(
    @CurrentUser('sub') userId: string,
    @Body() completeProfileDto: CompleteProfileRequestDto,
  ) {
    const user = await this.userService.completeProfile(userId, completeProfileDto);
    return { success: true, data: user, messageKey: 'SUCCESS_PROFILE_COMPLETED' };
  }

  @Put('me')
  @UseGuards(AuthGuard)
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() updateProfileDto: UpdateProfileRequestDto,
  ) {
    const user = await this.userService.updateProfile(userId, updateProfileDto);
    return { success: true, data: user, messageKey: 'SUCCESS_PROFILE_UPDATED' };
  }
}

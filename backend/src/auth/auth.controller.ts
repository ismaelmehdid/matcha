import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body('email') email: string, @Body('password') password: string, @Body('firstName') firstName: string, @Body('lastName') lastName: string, @Body('username') username: string) {
    return this.authService.register(email, password, firstName, lastName, username);
  }

  @Post('login')
  login(@Body('username') username: string, @Body('password') password: string) {
    return this.authService.login(username, password);
  }

  @Get('verify')
  verify(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.verifyToken(token);
  }
}

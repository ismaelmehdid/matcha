import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  private JWT_SECRET = process.env.JWT_SECRET;

  @Get('me')
  async getCurrentUser(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { sub: string; email: string };
      const user = await this.userService.findById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Remove sensitive data
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}


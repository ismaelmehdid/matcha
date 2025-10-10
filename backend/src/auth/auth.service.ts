import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  private JWT_SECRET = process.env.JWT_SECRET;

  async register(email: string, password: string, firstName: string, lastName: string, username: string) {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already in use');
    const user = await this.userService.create(email, password, firstName, lastName, username);
    return this.generateToken(user);
  }

  async login(username: string, password: string) {
    const valid = await this.userService.validatePassword(username, password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const user = await this.userService.findByUsername(username);
    return this.generateToken(user);
  }

  private generateToken(user: { id: string, email: string }) {
    const payload = { sub: user.id, email: user.email };
    const token = jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' });
    return { access_token: token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

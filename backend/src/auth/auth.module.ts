import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { RedisModule } from '../redis/redis.module';
import { DatabaseModule } from '../database/database.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UserModule, DatabaseModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule { }

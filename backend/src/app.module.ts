import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { InterestModule } from './interests/interest.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, DatabaseModule, InterestModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

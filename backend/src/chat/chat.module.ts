import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.controller';
import { ChatService } from './chat.service'; // Add this import
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [DatabaseModule],
})
export class ChatModule { }
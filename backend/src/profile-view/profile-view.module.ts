import { Module } from '@nestjs/common';
import { ProfileViewService } from './profile-view.service';
import { ProfileViewController } from './profile-view.controller';
import { ProfileViewRepository } from './repository/profile-view.repository';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/users/user.module';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [DatabaseModule, UserModule, NotificationModule],
  controllers: [ProfileViewController],
  providers: [ProfileViewService, ProfileViewRepository],
})
export class ProfileViewModule { }

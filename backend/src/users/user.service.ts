import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository, User } from './repositories/users.repository';
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';
import { InterestRepository } from 'src/interests/repository/interest.repository';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateUserDto,
  UpdateProfileDto,
  CompleteProfileDto,
  PublicUserResponseDto,
  PrivateUserResponseDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly interestRepository: InterestRepository,
    private readonly db: DatabaseService,
  ) { }

  private mapUserToPrivateUserResponseDto(user: User): PrivateUserResponseDto {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      gender: user.gender,
      sexualOrientation: user.sexual_orientation,
      biography: user.biography,
      profileCompleted: user.profile_completed,
      fameRating: user.fame_rating,
      latitude: user.latitude,
      longitude: user.longitude,
      lastTimeActive: user.last_time_active?.toISOString() || null,
      createdAt: user.created_at.toISOString(),
      email: user.email,
      username: user.username,
      isEmailVerified: user.is_email_verified,
      interests: user.interests,
      photos: user.photos,
    };
  }

  async findByUsername(username: string): Promise<PrivateUserResponseDto | null> {
    const user: User | null = await this.usersRepository.findByUsername(username);
    if (!user) return null;
    return this.mapUserToPrivateUserResponseDto(user);
  }

  async findByEmailOrUsername(email: string, username: string): Promise<PrivateUserResponseDto | null> {
    const user: User | null = await this.usersRepository.findByEmailOrUsername(email, username);
    if (!user) return null;
    return this.mapUserToPrivateUserResponseDto(user);
  }

  async findById(id: string): Promise<PrivateUserResponseDto | null> {
    const user: User | null = await this.usersRepository.findById(id);
    if (!user) return null;
    return this.mapUserToPrivateUserResponseDto(user);
  }

  async findByEmail(email: string): Promise<PrivateUserResponseDto | null> {
    const user: User | null = await this.usersRepository.findByEmail(email);
    if (!user) return null;
    return this.mapUserToPrivateUserResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<PrivateUserResponseDto> {
    const existingUser = await this.findByEmailOrUsername(
      createUserDto.email,
      createUserDto.username,
    );
    if (existingUser) throw new CustomHttpException('USERNAME_OR_EMAIL_ALREADY_EXISTS', 'Username or email already exists.', 'ERROR_USERNAME_OR_EMAIL_ALREADY_EXISTS', HttpStatus.CONFLICT);
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const user: User = await this.usersRepository.create({ ...createUserDto, password: passwordHash });
    return this.mapUserToPrivateUserResponseDto(user);
  }

  async validatePassword(username: string, password: string): Promise<boolean> {
    const user: User | null = await this.usersRepository.findByUsername(username);
    if (!user) return false;
    return bcrypt.compare(password, user.password_hash);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hash = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.updatePassword(userId, hash);
  }

  async updateEmailVerified(userId: string, isEmailVerified: boolean): Promise<void> {
    await this.usersRepository.updateEmailVerified(userId, isEmailVerified);
  }

  async completeProfile(userId: string, dto: CompleteProfileDto): Promise<PrivateUserResponseDto> {
    const existingUser = await this.usersRepository.findById(userId);
    if (!existingUser) { throw new CustomHttpException('USER_NOT_FOUND', 'User not found', 'ERROR_USER_NOT_FOUND', HttpStatus.NOT_FOUND); }
    if (existingUser.profile_completed) { throw new CustomHttpException('PROFILE_ALREADY_COMPLETED', 'Profile already completed', 'ERROR_PROFILE_ALREADY_COMPLETED', HttpStatus.BAD_REQUEST); }

    // Use a transaction to ensure both operations succeed or fail together
    const user = await this.db.transaction(async (client) => {
      await this.interestRepository.updateUserInterests(userId, dto.interestIds, client);

      const user = await this.usersRepository.completeProfile(
        userId,
        {
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
          sexualOrientation: dto.sexualOrientation,
          biography: dto.biography,
        },
        client
      );
      return user;
    });
    return this.mapUserToPrivateUserResponseDto(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<PrivateUserResponseDto> {
    const user: User = await this.usersRepository.updateProfile(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      gender: dto.gender,
      sexualOrientation: dto.sexualOrientation,
      biography: dto.biography,
    });
    return this.mapUserToPrivateUserResponseDto(user);
  }
}

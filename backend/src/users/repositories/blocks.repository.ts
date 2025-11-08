import { HttpStatus, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";

export interface Block {
  blocker_id: string;
  blocked_id: string;
}

@Injectable()
export class BlocksRepository {
  constructor(private readonly db: DatabaseService) { }

  async findAllUsersBlockedByUser(userId: string): Promise<string[]> {
    try {
      const result = await this.db.query<{ blocked_id: string }>(
        `SELECT blocked_id FROM blocks WHERE blocker_id = $1`,
        [userId]
      );
      return result.rows.map(row => row.blocked_id);
    } catch (error) {
      console.error(error);
      throw new CustomHttpException(
        'INTERNAL_SERVER_ERROR',
        'An unexpected internal server error occurred.',
        'ERROR_INTERNAL_SERVER',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllUsersWhoBlockedUser(userId: string): Promise<string[]> {
    try {
      const result = await this.db.query<{ blocker_id: string }>(
        `SELECT blocker_id FROM blocks WHERE blocked_id = $1`,
        [userId]
      );
      return result.rows.map(row => row.blocker_id);
    } catch (error) {
      console.error(error);
      throw new CustomHttpException(
        'INTERNAL_SERVER_ERROR',
        'An unexpected internal server error occurred.',
        'ERROR_INTERNAL_SERVER',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllBlockedUserIds(userId: string): Promise<string[]> {
    try {
      // Get users I blocked and users who blocked me
      const blockedByMe = await this.findAllUsersBlockedByUser(userId);
      const blockedByOthers = await this.findAllUsersWhoBlockedUser(userId);
      return [...new Set([...blockedByMe, ...blockedByOthers])];
    } catch (error) {
      console.error(error);
      throw new CustomHttpException(
        'INTERNAL_SERVER_ERROR',
        'An unexpected internal server error occurred.',
        'ERROR_INTERNAL_SERVER',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}


import { HttpStatus, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { User } from "./users.repository";
import { CustomHttpException } from "src/common/exceptions/custom-http.exception";

@Injectable()
export class LikesRepository {
  constructor(private readonly db: DatabaseService) { }

  async findAllUsersWhoUserLiked(userId: string): Promise<string[]> {
    try {
      const result = await this.db.query<{ to_user_id: string }>(`SELECT to_user_id FROM likes WHERE from_user_id = $1`, [userId]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new CustomHttpException('INTERNAL_SERVER_ERROR', 'An unexpected internal server error occurred.', 'ERROR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllUsersWhoLikedUserId(userId: string): Promise<string[]> {
    try {
      const result = await this.db.query<{ from_user_id: string }>(`SELECT from_user_id FROM likes WHERE to_user_id = $1`, [userId]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new CustomHttpException('INTERNAL_SERVER_ERROR', 'An unexpected internal server error occurred.', 'ERROR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
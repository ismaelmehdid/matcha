import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // Todo: Any other way to do this?
  private pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  async findById(id: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  async findByUsername(username: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  async findByEmail(email: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  async create(email: string, password: string, firstName: string, lastName: string, username: string) {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await this.pool.query(
      'INSERT INTO users(email, password_hash, first_name, last_name, username) VALUES ($1, $2, $3, $4, $5) RETURNING id, email',
      [email, hash, firstName, lastName, username],
    );
    return rows[0];
  }

  async validatePassword(username: string, plainPassword: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    if (!user) return false;
    return bcrypt.compare(plainPassword, user.password);
  }
}

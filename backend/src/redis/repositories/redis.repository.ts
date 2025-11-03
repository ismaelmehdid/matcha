import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisRepository {
  constructor() { }

  private readonly redisClient = createClient({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  async onModuleInit() {
    await this.redisClient.connect();
    console.log("Redis client connected");
  }

  async setEntry(key: string, value: string, expiration?: number): Promise<void> {
    if (expiration) {
      await this.redisClient.set(key, value, { EX: expiration });
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async getEntry(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async deleteEntry(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async incrementEntry(key: string): Promise<void> {
    await this.redisClient.incr(key);
  }

  async decrementEntry(key: string): Promise<void> {
    // Avoiding race condition using a script
    const script = `
      local val = redis.call('GET', KEYS[1])
      if not val then
        return 0
      end
      local n = tonumber(val)
      if not n or n <= 1 then
        redis.call('DEL', KEYS[1])
        return 0
      else
        return redis.call('DECR', KEYS[1])
      end
    `;
    await this.redisClient.eval(script, { keys: [key], arguments: [] });
  }

  async getEntries(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async getEntriesBatch(keys: string[]): Promise<(string | null)[]> {
    if (keys.length === 0) return [];
    return await this.redisClient.mGet(keys);
  }
}

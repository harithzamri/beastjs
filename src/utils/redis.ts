import Redis from "ioredis";

export function createRedis(): Redis.Redis {
  const redis = new Redis("url here");
  return redis;
}

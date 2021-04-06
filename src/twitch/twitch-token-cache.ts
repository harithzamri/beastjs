import assert from "assert";
import { createRedis } from "../utils/redis";

//prettier-ignore
export interface TokenData {
    "accessToken": string,
    "refreshToken": string,
    "expiryTimestamp": number | null
}

export async function writeTwitchTokens(tokenData: TokenData): Promise<void> {
  const redis = createRedis();
  await redis.hmset("twitchTokens", {
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
    expiryTimestamp: String(tokenData.expiryTimestamp),
  });
  await redis.quit();
}

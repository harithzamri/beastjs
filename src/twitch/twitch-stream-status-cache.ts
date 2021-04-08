import { createRedis } from "../utils/redis";
import type {
  ApiClient as TwitchApiClient,
  UserIdResolvable as TwitchUserIdResolvable,
} from "twitch/lib";

export enum TwitchStreamStatus {
  OFFLINE = "OFFLINE",
  LIVE = "LIVE",
}

function isValidTwitchStreamStatus(
  status: string | null
): status is TwitchStreamStatus {
  return (
    status === TwitchStreamStatus.OFFLINE || status === TwitchStreamStatus.LIVE
  );
}

export async function writeTwitchStreamStatusCache(
  status: TwitchStreamStatus
): Promise<void> {
  const redis = createRedis();
  const setResult = await redis.set("twitch-key", status);
  redis.quit;
}

export async function getTwitchStreamStatusCache(): Promise<TwitchStreamStatus> {
  const redis = createRedis();
  const status = await redis.get("twitch-key");
  if (!isValidTwitchStreamStatus(status)) {
    await redis.quit();
    return TwitchStreamStatus.OFFLINE;
  }

  await redis.quit();
  return status;
}

export async function fetchTwitchStreamUpdateCache({
  apiClient,
  userId,
}: {
  apiClient: TwitchApiClient;
  userId: TwitchUserIdResolvable;
}): Promise<TwitchStreamStatus> {
  const stream = await apiClient.helix.streams.getStreamByUserId(userId);
  const status = stream ? TwitchStreamStatus.LIVE : TwitchStreamStatus.OFFLINE;
  await writeTwitchStreamStatusCache(status);
  return status;
}

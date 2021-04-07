import type {
  ApiClient as TwitchApiClient,
  UserIdResolvable as TwitchUserIdResolvable,
} from "twitch/lib";

export enum TwitchStreamStatus {
  OFFLINE = "OFFLINE",
  LIVE = "LIVE",
}

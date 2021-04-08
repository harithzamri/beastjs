import type { ChatClient } from "twitch-chat-client/lib";
import type { ApiClient, HelixStream } from "twitch";
import type { Client as DiscordClient } from "discord.js";
import type { ConnectCompatibleApp } from "twitch-webhooks";
import { EnvPortAdapter, WebHookListener } from "twitch-webhooks";
import { Logger } from "@d-fischer/logger/lib";
import { getLogger } from "src/utils/logger";
import {
  fetchTwitchStreamUpdateCache,
  getTwitchStreamStatusCache,
  TwitchStreamStatus,
} from "./twitch-stream-status-cache";

export interface TwitchWebHookManagerConfig {
  apiClient: ApiClient;
  chatClient: ChatClient;
  discordClient: DiscordClient;
}

function getStreamStatus(stream: HelixStream | undefined): TwitchStreamStatus {
  return stream ? TwitchStreamStatus.LIVE : TwitchStreamStatus.OFFLINE;
}

function wentOnline(
  previousState: TwitchStreamStatus,
  currentStatus: TwitchStreamStatus
): boolean {
  return (
    previousState === TwitchStreamStatus.OFFLINE &&
    currentStatus === TwitchStreamStatus.LIVE
  );
}

function wentOffline(
  previousState: TwitchStreamStatus,
  currentStatus: TwitchStreamStatus
): boolean {
  return (
    previousState === TwitchStreamStatus.LIVE &&
    currentStatus === TwitchStreamStatus.OFFLINE
  );
}

export class TwitchWebhookManager {
  private _apiClient: ApiClient;
  private _chatClient: ChatClient;
  private _discordClient: DiscordClient;
  private listener: WebHookListener;
  private _logger: Logger;

  constructor({
    apiClient,
    chatClient,
    discordClient,
  }: TwitchWebHookManagerConfig) {
    this._apiClient = apiClient;

    this._chatClient = chatClient;
    this._discordClient = discordClient;

    this.listener = new WebHookListener(
      apiClient,
      new EnvPortAdapter({
        hostName: "example.com",
        port: 8080,
      }),
      {
        logger: {
          name: "twitch-webhook-listener",
          timestamps: true,
          minLevel: "DEBUG",
          colors: false,
        },
      }
    );

    this._logger = getLogger({
      name: "reabeastbot-twitch-webhook-manager",
    });
  }

  private async _subscribeToStreamChanges(
    userId: string,
    username: string
  ): Promise<void> {
    const initialStatus = await fetchTwitchStreamUpdateCache({
      apiClient: this._apiClient,
      userId,
    });

    this._logger.info("Initial Stream Status :" + initialStatus);

    await this.listener.subscribeToStreamChanges(
      userId,
      async (stream?: HelixStream) => {
        this._logger.info("Stream Change" + JSON.stringify(stream));
        const previousStatus = await getTwitchStreamStatusCache();
        const currentStatus = getStreamStatus(stream);
        const streamStatusData = {
          previousStatus,
          currentStatus,
          becameLive: wentOnline(previousStatus, currentStatus),
          becameOffline: wentOffline(previousStatus, currentStatus),
        };
        this._logger.info(JSON.stringify(streamStatusData));
        if (stream) {
          const game = await stream.getGame();
          const gameName = game ? game.name : "<unknown game>";
          const streamData = {
            id: stream.id,
            userId: stream.userId,
            userDisplayName: stream.userDisplayName,
            gameId: stream.gameId,
            type: stream.type,
            title: stream.title,
            viewers: stream.viewers,
            startDate: stream.startDate,
            language: stream.language,
            thumbnailUrl: stream.thumbnailUrl,
            tagIds: stream.tagIds,
            game: {
              id: game ? game.id : "<unknown id>",
              name: gameName,
              boxArtUrl: game ? game.boxArtUrl : "<unknown url>",
            },
          };
          this._logger.info(JSON.stringify(streamData));

          const noPing = stream.title.includes("test");
        }
      }
    );
  }
}

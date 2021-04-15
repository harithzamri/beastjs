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
  writeTwitchStreamStatusCache,
} from "./twitch-stream-status-cache";
import { DiscordNotifier } from "../discord/discord-notifier";
import {
  getTwitchOfflineEmbed,
  getTwitchStreamEmbed,
} from "src/discord/discord-embed";

export interface TwitchWebHookManagerConfig {
  apiClient: ApiClient;
  chatClient: ChatClient;
  discordNotifier: DiscordNotifier;
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
  private _discordNotifier: DiscordNotifier;
  private _listener: WebHookListener;
  private _logger: Logger;
  private _thankedFollowers = new Set<string>();

  constructor({
    apiClient,
    chatClient,
    discordNotifier,
  }: TwitchWebHookManagerConfig) {
    this._apiClient = apiClient;
    this._discordNotifier = discordNotifier;
    this._chatClient = chatClient;

    this._listener = new WebHookListener(
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

  public async listen(app: ConnectCompatibleApp): Promise<void> {
    const userId = "harithtoikee";
    const username = "harithtoikee";
    this._listener.applyMiddleware(app);
    await Promise.all([
      this._subscribeToStreamChanges(userId, username),
      this._subscribeToFollowsToUser(userId, username),
    ]);
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

    await this._listener.subscribeToStreamChanges(
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
          if (noPing) {
            await this._discordNotifier.notifyTestChannel({
              content: "no idea",
              embed: getTwitchStreamEmbed({
                title: stream.title,
                gameName,
                startDate: stream.startDate,
                thumbnailURL: stream.thumbnailUrl,
                boxArtURL: null,
              }),
            });
          } else if (wentOnline(previousStatus, currentStatus)) {
            const pingRole = "streamping";
            await this._discordNotifier.notifyStreamStatusChannel({
              content: `<@&${pingRole}> ${username} went live`,
              embed: getTwitchStreamEmbed({
                title: stream.title,
                gameName,
                startDate: stream.startDate,
                thumbnailURL: stream.thumbnailUrl,
                boxArtURL: game ? game.boxArtUrl : null,
              }),
            });
          }
        } else if (wentOffline(previousStatus, currentStatus)) {
          await this._discordNotifier.notifyStreamStatusChannel({
            content: `${username} went offline`,
            embed: getTwitchOfflineEmbed({
              startDate: new Date(),
            }),
          });
        }
        await writeTwitchStreamStatusCache(currentStatus);
      }
    );
  }

  private async _subscribeToFollowsToUser(
    userId: string,
    userName: string
  ): Promise<void> {
    await this._listener.subscribeToFollowsToUser(userId, (follow) => {
      this._logger.info("Follow :" + JSON.stringify(follow));
      if (this._thankedFollowers.has(follow.userId)) {
        this._logger.warn("User has already has been thanked; returning");
        return;
      }
      this._chatClient.say(
        userName,
        `@${follow.userDisplayName} thank you for the follow`
      );
      this._thankedFollowers.add(follow.userId);
    });
  }
}

import type { ChatClient } from "twitch-chat-client/lib";
import type { ApiClient, HelixStream } from "twitch";
import type { Client as DiscordClient } from "discord.js";
import type { ConnectCompatibleApp } from "twitch-webhooks";
import { EnvPortAdapter, WebHookListener } from "twitch-webhooks";
import { Logger } from "@d-fischer/logger/lib";
import { getLogger } from "src/utils/logger";
import { TwitchStreamStatus } from "./twitch-stream-status-cache";

export interface TwitchWebHookManagerConfig {
  apiClient: ApiClient;
  chatClient: ChatClient;
  discordClient: DiscordClient;
}

function getStreamStatus(stream: HelixStream | undefined): TwitchStreamStatus {
  return stream ? TwitchStreamStatus.LIVE : TwitchStreamStatus.OFFLINE;
}

export class TwitchWebhookManager {
  private _apiClient: ApiClient;
  private _chatClient: ChatClient;
  private _discordClient: DiscordClient;
  private _webhook: WebHookListener;
  private _logger: Logger;

  constructor({
    apiClient,
    chatClient,
    discordClient,
  }: TwitchWebHookManagerConfig) {
    this._apiClient = apiClient;

    this._chatClient = chatClient;
    this._discordClient = discordClient;

    this._webhook = new WebHookListener(
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
}

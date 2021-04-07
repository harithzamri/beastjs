import type { ChatClient } from "twitch-chat-client/lib";
import type {} from "twitch-webhooks/lib";
import { ApiClient } from "twitch";
import { Client as DiscordClient } from "discord.js";
import { TwitchManagerConfig } from "./twitch-command-manager";
import { Logger } from "@d-fischer/logger/lib";
import { getLogger } from "src/utils/logger";

export interface TwitchEventManagerConfig {
  apiClient: ApiClient;
  chatClient: ChatClient;
  discordClient: DiscordClient;
}

export class TwitchEvevntManager {
  private _apiClient: ApiClient;
  private _chatClient: ChatClient;
  private _discordClient: DiscordClient;
  private _commandManager: TwitchManagerConfig;
  private _logger: Logger;

  constructor({
    apiClient,
    chatClient,
    discordClient,
  }: TwitchEventManagerConfig) {
    this._apiClient = apiClient;
    this._chatClient = chatClient;
    this._discordClient = discordClient;

    this._logger = getLogger({
      name: "realbeast-twitch-event-manager",
    });

    this._commandManager = new TwitchManagerConfig({
      apiClient: this._apiClient,
      chatClient: this._chatClient,
    });
  }
}

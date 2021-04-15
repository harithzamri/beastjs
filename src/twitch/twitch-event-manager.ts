import type { ChatClient } from "twitch-chat-client/lib";
import type { ConnectCompatibleApp } from "twitch-webhooks/lib";
import { ApiClient } from "twitch";
import { Client as DiscordClient } from "discord.js";
import { TwitchCommandManager } from "./twitch-command-manager";
import { Logger } from "@d-fischer/logger/lib";
import { getLogger } from "../utils/logger";
import { TwitchWebhookManager } from "./twitch-webhook-manager";
import { DiscordNotifier } from "../discord/discord-notifier";

export interface TwitchEventManagerConfig {
  apiClient: ApiClient;
  chatClient: ChatClient;
  discordClient: DiscordClient;
}

export class TwitchEvevntManager {
  private _apiClient: ApiClient;
  private _chatClient: ChatClient;
  private _discordClient: DiscordClient;
  private _commandManager: TwitchCommandManager;
  private _logger: Logger;
  private _webHookManager: TwitchWebhookManager;
  private _discordNotifier: DiscordNotifier;

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

    this._commandManager = new TwitchCommandManager({
      apiClient: this._apiClient,
      chatClient: this._chatClient,
    });

    this._webHookManager = new TwitchWebhookManager({
      apiClient: this._apiClient,
      chatClient: this._chatClient,
      discordNotifier: this._discordNotifier,
    });
  }

  public async listen(app: ConnectCompatibleApp): Promise<void> {
    await this._commandManager.listen();
    await this._webHookManager.listen(app);

    const chatClient = this._chatClient;

    chatClient.onSub((channel, user, subInfo, msg) => {
      this._logger.debug(
        "onSub: " +
          JSON.stringify({
            channel,
            user,
            subInfo,
            msg,
          })
      );

      let suffix = "!";

      switch (subInfo.plan) {
        case "1000":
          suffix = " at Tier 1!";
          break;
        case "2000":
          suffix = " at Tier 2!";
          break;
        case "3000":
          suffix = " at Tier 3!";
          break;
        case "Prime":
          suffix = " at Prime!";
          break;
        default:
          this._logger.warn(`Unknown plan ${subInfo.plan}`);
      }
    });
  }
}

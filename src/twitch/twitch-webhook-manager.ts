import type { ChatClient } from "twitch-chat-client/lib";
import type { ApiClient } from "twitch";
import type { Client as DiscordClient } from "discord.js";
import type { ConnectCompatibleApp } from "twitch-webhooks";
import { EnvPortAdapter, WebHookListener } from "twitch-webhooks";

export interface TwitchWebHookManagerConfig {
  apiClient: ApiClient;
  chatClient: ChatClient;
  discordClient: DiscordClient;
}

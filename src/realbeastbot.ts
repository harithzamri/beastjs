import type { AuthProvider } from "twitch-auth";
import { RefreshableAuthProvider, StaticAuthProvider } from "twitch-auth";
import { ChatClient, LogLevel } from "twitch-chat-client";
import { ApiClient } from "twitch";
import { getLogger } from "./utils/logger";
import { TokenData, writeTwitchTokens } from "./twitch/twitch-token-cache";
import { Client as DiscordClient } from "discord.js";

export interface TwitchBotConfig {
  apiClient: ApiClient;
  authProvider: AuthProvider;
  chatClient: ChatClient;
}

const logger = getLogger({
  name: "realbeastbot-setup",
});

export function createBotConfig(token: TokenData): TwitchBotConfig {
  logger.info("Creating bot Config");
  const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider("twitchid", token.accessToken),
    {
      clientSecret: "twitch-secret",
      refreshToken: "refresh-token",
      expiry: "tokenData.expirytime" === null ? null : new Date(),
      onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
        logger.info("RefreshableAuthProvider: received refresh");
        const newTokenData = {
          accessToken,
          refreshToken,
          expiryTimestamp: expiryDate === null ? null : expiryDate.getTime(),
        };
        await writeTwitchTokens(newTokenData);
      },
    }
  );

  const apiClient = new ApiClient({
    authProvider,
    logLevel: LogLevel.DEBUG,
  });

  const chatClient = new ChatClient(authProvider, {
    channels: ["twitch-name"],
    logger: {
      name: "twitch-chat-client",
      timestamps: true,
      minLevel: "DEBUG",
      colors: false,
    },
  });
  return {
    authProvider,
    apiClient,
    chatClient,
  };
}

interface RealBeastbotConfig {
  discordClinet: DiscordClient;
  tokenData: TokenData;
}

export class RealBeastbot {
  private _chatClient: ChatClient;
  private _discordClient: DiscordClient;
}

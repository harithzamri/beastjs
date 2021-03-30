import type { ChatClient } from "twitch-chat-client";
import type { ApiClient } from "twitch/lib";
import type { Logger } from "@d-fischer/logger";
import { getLogger } from "../utils/logger";
import { SimpleTwitchBot } from "./simple-twitch-bot";
import humanizeDuration from "humanize-duration";

export interface TwitchCommandManagerConfig {
  apiClient: ApiClient;
  chatClient: ChatClient;
}

function durationInEnglish(duration: number): string {
  return humanizeDuration(duration, {
    units: ["y", "mo", "w", "d", "h", "m"],
    round: true,
  });
}

const COMMAND_PREFIX = "hello";

export class TwitchManagerConfig {
  private _apiClient: ApiClient;
  private _chatClient: ChatClient;
  private _logger: Logger;
  private _simpleTwitchBot: SimpleTwitchBot;

  constructor({ apiClient, chatClient }: TwitchCommandManagerConfig) {
    this._apiClient = apiClient;

    this._chatClient = chatClient;

    this._logger = getLogger({
      name: "beast-js-bot",
    });

    this._simpleTwitchBot = new SimpleTwitchBot({
      chatClient: this._chatClient,
      commandPrefix: COMMAND_PREFIX,
    });

    this.initCommands();
  }

  private initCommands(): void {
    this._simpleTwitchBot.addCommand("!ping", async (params, context) => {
      context.say("!pong");
    });

    this._simpleTwitchBot.addCommand("followage", async (params, context) => {
      const follow = await this._apiClient.kraken.users.getFollowedChannel(
        context.msg.userInfo.userId as string,
        context.msg.channelId as string
      );
      if (follow) {
        const followDate = follow.followDate;
        const duration = new Date().getTime() - followDate.getTime();
        const durationEnglish = durationInEnglish(duration);
        context.say(
          `@${context.user} You have been following for ${durationEnglish}`
        );
      } else {
        context.say(`@${context.user} You are not following`);
      }
    });

    this._simpleTwitchBot.addCommand(
      "!uptime",
      async (params, context) => {
        const stream = await this._apiClient.helix.streams.getStreamByUserName(
          "harithtoikee"
        );
        if (!stream) {
          context.say("Stream is live, but I failed to fetch stream data :(");
          return;
        }

        const duration = new Date().getTime() - stream.startDate.getTime();
        const durationEnglish = durationInEnglish(duration);
        context.say(`Stream has been live fro ${durationEnglish}`);
      },
      {
        cooldown: {
          time: 1000,
          reply: false,
        },
      }
    );

    this._simpleTwitchBot.addCommand("!record", async (params, context) => {});
  }
}

import { Logger } from "@d-fischer/logger/lib";
import type {
  Client as DiscordClient,
  Channel as DiscordChannel,
  MessageEmbed,
} from "discord.js";
import { getLogger } from "src/utils/logger";

interface DiscordNotifierConfig {
  discordClient: DiscordClient;
}

interface MessageConfig {
  content: string;
  embed?: MessageEmbed;
}

export class DiscordNotifier {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _streamingMembersChannel?: DiscordChannel;
  private _streamStatusChannel?: DiscordChannel;
  private _testChannel: DiscordChannel;

  constructor({ discordClient }: DiscordNotifierConfig) {
    this._discordClient = discordClient;

    this._logger = getLogger({
      name: "Realbeast-notifier",
    });
  }
}

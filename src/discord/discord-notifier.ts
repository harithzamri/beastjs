import { Logger } from "@d-fischer/logger/lib";
import  {
  Client as DiscordClient,
  Channel as DiscordChannel,
  MessageEmbed,
} from "discord.js";
import { DISCORD_CHANNEL_ID } from "../utils/constants";
import { getLogger } from "../utils/logger";

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
  private _streamStatusChannel?: DiscordChannel;
  private _testChannel?: DiscordChannel;

  constructor({ discordClient }: DiscordNotifierConfig) {
    this._discordClient = discordClient;

    this._logger = getLogger({
      name: "Realbeast-notifier",
    });

    this._streamStatusChannel = this._discordClient.channels.cache.get(
      DISCORD_CHANNEL_ID.STREAM_STATUS
    );
  }

  public async notifyStreamStatusChannel(message: MessageConfig) {
    if(this._streamStatusChannel && this._streamStatusChannel.isText()){
      
    }
  
}

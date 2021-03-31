import { Logger } from "@d-fischer/logger/lib";
import { Player } from "discord-player";
import type {
  Client as DiscordClient,
  Activity,
  Guild,
  Message,
  User as DiscordUser,
} from "discord.js";
import humanizeDuration from "humanize-duration";
import { getLogger } from "src/utils/logger";

interface DiscordEventManagerConfig {
  discordClient: DiscordClient;
}

const settings = {
  prefix: "!",
};

export class DiscordEventManager {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _guild: Guild;
  private _player: Player;
  private _membersStreamingCooldown = new Map<string, Date>();

  constructor({ discordClient }: DiscordEventManagerConfig) {
    this._discordClient = discordClient;
    this._logger = getLogger({ name: "beast-discord-event-manager" });
    const guilds = this._discordClient.guilds.cache.array();
    this._guild = guilds[0];
    this._player = new Player(this._discordClient);
  }

  public async listen(): Promise<void> {
    this._logger.info("Listening to events");
    this._discordClient.on("debug", (msg) => {
      const message = `[cllient debug] ${msg}`;
      this._logger.debug(message);
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!ping") {
        msg.channel.send("pong");
      }
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!latency") {
        msg.channel.send(
          `Latency for this server is ${Date.now() - msg.createdTimestamp}ms `
        );
      }
    });

    this._discordClient.on("message", (msg: Message) => {
      const args = msg.content
        .slice(settings.prefix.length)
        .trim()
        .split(/ +/g);
      const command = args.shift()?.toLowerCase();

      if (command === "play") {
        this._player.play(msg, args[0], true);
      }
    });
  }
}

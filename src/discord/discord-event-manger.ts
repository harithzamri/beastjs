import { Logger } from "@d-fischer/logger/lib";
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

export class DiscordEventManager {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _guild: Guild;
  private _membersStreamingCooldown = new Map<string, Date>();

  constructor({ discordClient }: DiscordEventManagerConfig) {
    this._discordClient = discordClient;
    this._logger = getLogger({ name: "beast-discord-event-manager" });
    const guilds = this._discordClient.guilds.cache.array();
    this._guild = guilds[0];
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
  }

  private async _addRoleToUser(role: string, user: DiscordUser) {
    try {
      const guildMember = await this._guild.members.fetch(user);
      await guildMember.roles.add(role);
      this._logger.info(`Addes role ${role} fro ${user.tag}`);
    } catch (error) {
      this._logger.error(`Adding role ${role} for ${user.tag} FAILED`);
      this._logger.error(error);
    }
  }
}

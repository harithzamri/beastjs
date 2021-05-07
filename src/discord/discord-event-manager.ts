import { Logger } from "@d-fischer/logger/lib";
import { Player } from "discord-player";
import {
  Activity,
  Client as DiscordClient,
  User as DiscordUser,
  Message,
  Presence,
  Guild,
} from "discord.js";
import assert from "assert";
import { getLogger } from "../utils/logger";
import {
  DISCORD_CHANNEL_ID,
  DISCORD_ROLE_ID,
  DISCORD_USER_ID,
} from "../utils/constants";
import { refreshed } from "../utils/time-utils";
import humanizeDuration from "humanize-duration";
import { DiscordNotifier } from "./discord-notifier";
import { play } from "../music/play";

interface DiscordEventManagerConfig {
  discordClient: DiscordClient;
}

const settings = {
  prefix: "!",
};

function getStreamingActivity(presence: Presence | undefined): Activity | null {
  if (!presence) {
    return null;
  }

  const streamingActivity = presence.activities.find((activity) => {
    if (activity.url === null) {
      return false;
    }
    return activity.type === "STREAMING" && activity?.url.length > 0;
  });

  if (!streamingActivity) {
    return null;
  }

  return streamingActivity;
}

export class DiscordEventManager {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _player: Player;
  private _guild: Guild;
  private _discordNotifier: DiscordNotifier;
  private _membersStreamingCooldown = new Map<string, Date>();

  constructor({ discordClient }: DiscordEventManagerConfig) {
    this._discordClient = discordClient;
    this._logger = getLogger({ name: "beast-discord-event-manager" });
    this._player = new Player(this._discordClient);

    const guilds = this._discordClient.guilds.cache.array();
    this._guild = guilds[0];
  }

  public async listen(): Promise<void> {
    this._logger.info("Listening to events");
    this._discordClient.on("debug", (msg) => {
      const message = `[client debug] ${msg}`;
      this._logger.debug(message);
    });

    this._player.on("trackStart", (message, track) =>
      message.channel.send(`Now playing ${track.title}...`)
    );

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!latency") {
        msg.channel.send(
          `Latency for this server is ${Date.now() - msg.createdTimestamp}ms `
        );
      }
    });

    //music-command
    this._discordClient.on("message", async (msg: Message) => {
      play({ msg, player: this._player });

      if (msg.content === "!pause") {
        this._player.pause(msg);
        msg.channel.send("Now Pausing the song");
      }
      if (msg.content === "!resume") {
        this._player.resume(msg);
        msg.channel.send("Resuming the song");
      }

      if (msg.content === "!stop") {
        this._player.stop(msg);
        msg.channel.send("Music has been stopped");
      }
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!greetings") {
        msg.channel.send(`Hi Bitch <@${msg.author.id}>`);
      }
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!welp") {
        const channel = this._discordClient.channels.cache.get(
          DISCORD_CHANNEL_ID.BOT_CHANNEL
        );
        console.log(channel);
      }
    });
  }

  private async _onPresenceUpdate(
    oldPresence: Presence | undefined,
    newPresence: Presence
  ) {
    const user = newPresence.user;
    if (!user) {
      this._logger.error(
        "[presence] presenceUpdate event received without newPresence.user"
      );
      return;
    }

    this._logger.info(`[presence] presenceUpdate user: ${user.tag}`);

    if (user.id === DISCORD_USER_ID.TOIKEE) {
      this._logger.info("[presence] ignoring presence update from slaurent");
      return;
    }

    const oldStreamingActivity = getStreamingActivity(oldPresence);
    const newStreamingActivity = getStreamingActivity(newPresence);

    //not streaming
    if (!oldStreamingActivity && !newStreamingActivity) {
      return;
    }

    if (oldStreamingActivity && newStreamingActivity) {
      this._logger.info(`[presence] ${user.id} ${user.tag} is still streaming`);
      return;
    }

    if (oldStreamingActivity && !newStreamingActivity) {
      this._logger.info(`[presence] ${user.id} ${user.tag} is still streaming`);
      return;
    }

    assert(
      newStreamingActivity,
      `[presence] ${user.id} if newStreamingActivity is null, logic is broken`
    );

    if (!newStreamingActivity?.url) {
      this._logger.info(
        `[presence] ${user.id} ${user.tag} is streaming, but without a url`
      );
      return;
    }

    await this._addRoleToUser(DISCORD_ROLE_ID.MEMBERS, user);

    const previousMessageDate = this._membersStreamingCooldown.get(user.id);
    if (previousMessageDate && !refreshed(previousMessageDate, 20)) {
      this._logger.info(
        `[presence] ${
          user.tag
        } was already broadcasted to #streaming-members within the past ${humanizeDuration(
          20
        )}`
      );

      await this._discordNotifier.notifyTestChannel({
        content: `Ignoring streaming update from ${
          user.id
        } due to cooldown (last triggered ${String(20)})`,
      });
      return;
    }

    const guildMember = await this._guild.members.fetch(user);

    const message = {
      content: `${guildMember.displayName} is streaming at ${newStreamingActivity.url}`,
    };

    await this._discordNotifier.notifyStreamStatusChannel(message);
    this._membersStreamingCooldown.set(user.id, new Date());
  }

  private async _addRoleToUser(role: string, user: DiscordUser) {
    try {
      const guildMember = await this._guild.members.fetch(user);
      await guildMember.roles.remove(role);
      this._logger.info(`Added role ${role} for ${user.tag}`);
    } catch (error) {
      this._logger.error(`Adding role ${role} for ${user.tag} FAILED`);
      this._logger.error(error);
    }
  }
}

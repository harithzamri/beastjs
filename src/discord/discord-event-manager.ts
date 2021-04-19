import { Logger } from "@d-fischer/logger/lib";
import { Player, Track } from "discord-player";
import {
  Activity,
  Channel,
  Client as DiscordClient,
  Message,
  Presence,
} from "discord.js";
import { getLogger } from "../utils/logger";
import { getBasicInfo, videoInfo } from "ytdl-core";
import { getMusicStreamEmbed } from "./discord-embed";
import {
  DISCORD_CHANNEL_ID,
  DISCORD_ROLE_ID,
  DISCORD_USER_ID,
} from "../utils/constants";
import { play } from "../music/play";
import { assert } from "node:console";

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

  constructor({ discordClient }: DiscordEventManagerConfig) {
    this._discordClient = discordClient;
    this._logger = getLogger({ name: "beast-discord-event-manager" });
    this._player = new Player(this._discordClient);
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
    }
  }
}

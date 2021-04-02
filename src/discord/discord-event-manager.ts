import { Logger } from "@d-fischer/logger/lib";
import { Player, Track } from "discord-player";
import type { Client as DiscordClient, Guild, Message } from "discord.js";
import { getLogger } from "../utils/logger";
import { getBasicInfo, videoInfo } from "ytdl-core";
import { getMusicStreamEmbed } from "./discord-embed";
import { YouTube } from "youtube-sr";

interface DiscordEventManagerConfig {
  discordClient: DiscordClient;
}

const settings = {
  prefix: "?",
};

export class DiscordEventManager {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _player: Player;

  constructor({ discordClient }: DiscordEventManagerConfig) {
    this._discordClient = discordClient;
    this._logger = getLogger({ name: "beast-discord-event-manager" });
    this._player = new Player(this._discordClient);
    this._player.on("trackStart", (message, track) =>
      message.channel.send(`Now playing ${track.title}...`)
    );
  }

  public async listen(): Promise<void> {
    this._logger.info("Listening to events");
    this._discordClient.on("debug", (msg) => {
      const message = `[cllient debug] ${msg}`;
      this._logger.debug(message);
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!latency") {
        msg.channel.send(
          `Latency for this server is ${Date.now() - msg.createdTimestamp}ms `
        );
      }
    });

    this._discordClient.on("message", async (msg: Message) => {
      const args = msg.content
        .slice(settings.prefix.length)
        .trim()
        .split(/ +/g);
      const command = args.shift()?.toLowerCase();

      if (command === "play") {
        this._player.play(msg, args[0], true);
      }
      await getBasicInfo(args[0])
        .then((videoUrlData: videoInfo) => {
          const { title, url, duration, thumbnail } = new Track(
            {
              title: videoUrlData.videoDetails.title,
              url: videoUrlData.videoDetails.video_url,
              views: videoUrlData.videoDetails.viewCount,
              thumbnail: videoUrlData.videoDetails.thumbnails[0],
              lengthSeconds: videoUrlData.videoDetails.lengthSeconds,
              description: videoUrlData.videoDetails.description,
              author: {
                name: videoUrlData.videoDetails.author.name,
              },
            },
            msg.author,
            this._player
          );
          msg.channel.send(
            getMusicStreamEmbed({
              title,
              duration,
              url,
              thumbnailUrl: thumbnail,
              requestedBy: msg.author.username,
            })
          );
        })
        .catch((error) => {});
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!pause") {
        this._player.pause(msg);
        msg.channel.send("Now Pausing the song");
      }
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!resume") {
        this._player.resume(msg);
        msg.channel.send("Resuming the song");
      }
    });

    this._discordClient.on("message", (msg: Message) => {
      if (msg.content === "!greetings") {
        msg.channel.send(`Hi Bitch <@${msg.author.id}>`);
      }
    });
  }
}

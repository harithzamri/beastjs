import type {
  Client,
  Client as DiscordClient,
  Message,
  User,
} from "discord.js";
import { Collection, Snowflake } from "discord.js";
import { Logger } from "@d-fischer/logger";
import EventEmitter from "events";
import { getLogger } from "../utils/logger";
import { MusicUtils } from "../utils/music-utils";
import { SimpleQueue } from "./music-queue";
import { SimpleTrack } from "./music-track";
import { Playlist, Video, YouTube } from "youtube-sr";

type MusicQuality = "high" | "low";

interface PlayerOptions {
  leaveOnEnd?: boolean;
  leaveOnEndCooldown?: number;
  leaveOnStop?: boolean;
  leaveOnEmpty?: boolean;
  leaveOnEmptyCooldown?: number;
  autoSelfDeaf?: boolean;
  quality?: MusicQuality;
  enableLive?: boolean;
  ytdlRequestOptions?: any;
}

export interface DiscordConfig {
  discordClient: DiscordClient;
  options: PlayerOptions;
}

export class SimplePlayer extends EventEmitter {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _options: {} | undefined;
  private _util: MusicUtils;
  private _cooldownsTimeout = new Collection<any, any>();
  private _queus = new Collection<Snowflake, SimpleQueue>();

  constructor(discordClient: Client, options?: {}) {
    super();

    this._discordClient = discordClient;
    this._options = options;

    this._logger = getLogger({
      name: "beast-bot-searching-tracks",
    });

    this._util = new MusicUtils();

    this._queus = new Collection();
  }

  public isplaying(message: Message): boolean {
    return this._queus.some((g) => g._guildID === message.guild?.id);
  }

  public async play(
    message: Message,
    query: string | SimpleTrack,
    _firstResult?: boolean,
    isAttachment?: boolean
  ): Promise<void> {
    if (this._cooldownsTimeout.has(`end_${message.guild?.id}`)) {
      clearTimeout(this._cooldownsTimeout.get(`end_${message.guild?.id}`));
      this._cooldownsTimeout.delete(`end_${message.guild?.id}`);
    }
    if (!query || typeof query !== "string")
      throw new Error("Play function requires search query but received none!");

    query = query.replace(/<(.+)>/g, "$1");
    if (
      !this._util.isDiscordAttachment(query) &&
      !isAttachment &&
      this._util.isYTPlaylistLink(query)
    ) {
    }
  }

  public async _handlePlaylist(
    message: Message,
    query: string
  ): Promise<boolean> {
    var duration: number;
    this.emit("playlistParseStart", {}, message);
    const playlist = await YouTube.getPlaylist(query);
    if (!playlist) return this.emit("noResults", message, query);
    let tracks: any[] = playlist.videos.map(
      (item: Video) => new SimpleTrack(item, message.author, this)
    );
    duration = tracks.reduce((prev: any, next: any) => prev + next.duration, 0);
    let thumbnail: any = tracks[0].thumbnail;
    console.log("duration", thumbnail);

    return true;
  }
}

import type { Client as DiscordClient, Message } from "discord.js";
import { Collection, Snowflake } from "discord.js";
import { Logger } from "@d-fischer/logger";
import EventEmitter from "node:events";
import { getLogger } from "src/utils/logger";
import { MusicUtils } from "../utils/music-utils";
import { SimpleQueue } from "./music-queue";
import { SimpleTrack } from "./music-track";

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

export class SimpleSearch extends EventEmitter {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _options: {};
  private _util: MusicUtils;
  private _cooldownsTimeout = new Collection<any, any>();
  private _queus = new Collection<Snowflake, SimpleQueue>();

  constructor({ discordClient, options }: DiscordConfig) {
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

  public play(
    message: Message,
    query: string | SimpleTrack,
    firstResult?: boolean,
    isAttachment?: boolean
  ): Promise<void> {
    if (this._cooldownsTimeout.has(`end_${message.guild?.id}`)) {
      clearTimeout(this._cooldownsTimeout.get(`end_${message.guild?.id}`));
      this._cooldownsTimeout.delete(`end_${message.guild?.id}`);
    }
  }
}

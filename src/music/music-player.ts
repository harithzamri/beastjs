import type {
  Client,
  Client as DiscordClient,
  Message,
  VoiceConnection,
} from "discord.js";
import ytdl from "discord-ytdl-core";
import { Collection, Snowflake } from "discord.js";
import { Logger } from "@d-fischer/logger";
import EventEmitter from "events";
import { getLogger } from "../utils/logger";
import { MusicUtils } from "../utils/music-utils";
import { SimpleQueue } from "./music-queue";
import { SimpleTrack } from "./music-track";
import { Video, YouTube } from "youtube-sr";
import type { Filters } from "./music-queue";

const filters = {
  bassboost: "bass=g=20",
  "8D": "apulsator=hz=0.09",
  vaporwave: "aresample=48000,asetrate=48000*0.8",
  nightcore: "aresample=48000,asetrate=48000*1.25",
  phaser: "aphaser=in_gain=0.4",
  tremolo: "tremolo",
  vibrato: "vibrato=f=6.5",
  reverse: "areverse",
  treble: "treble=g=5",
  normalizer: "dynaudnorm=g=101",
  surrounding: "surround",
  pulsator: "apulsator=hz=1",
  subboost: "asubboost",
  karaoke: "stereotools=mlev=0.03",
  flanger: "flanger",
  gate: "agate",
  haas: "haas",
  mcompand: "mcompand",
  mono: "pan=mono|c0=.5*c0+.5*c1",
  mstlr: "stereotools=mode=ms>lr",
  mstrr: "stereotools=mode=ms>rr",
  compressor: "compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6",
  expander:
    "compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3",
  softlimiter:
    "compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8",
  chorus: "chorus=0.7:0.9:55:0.4:0.25:2",
  chorus2d: "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3",
  chorus3d: "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
  fadein: "afade=t=in:ss=0:d=10",
};

type PlayerFilters = {
  [key in Filters]: string;
};

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
  private _options: PlayerOptions | undefined;
  private _util: MusicUtils;
  private _filters: PlayerFilters;
  private _cooldownsTimeout = new Collection<string, any>();
  private _queus = new Collection<Snowflake | undefined, SimpleQueue>();

  constructor(discordClient: Client, options?: PlayerOptions) {
    super();

    this._discordClient = discordClient;
    this._options = options;

    this._logger = getLogger({
      name: "beast-bot-searching-tracks",
    });

    this._util = new MusicUtils();

    this._filters = filters;
  }

  public isPlaying(message: Message): boolean {
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
    duration = tracks.reduce(
      (prev: any, next: any) => prev + next._duration,
      0
    );
    let thumbnail: any = tracks[0]._thumbnail;
    let requestedBy: {} = message.author;

    this.emit("playlistParseEnd", playlist, message);

    if (this.isPlaying(message)) {
      const queue = this._addTracksToQueue(message, tracks);
      this.emit("playlistAdd", message, queue, playlist);
    } else {
      const track = tracks.shift();
    }

    return true;
  }

  private _addTracksToQueue(message: Message, tracks: SimpleTrack[]) {
    const queue = this.getQueue(message);
    if (!queue) throw new Error("cannot add tracks to queue");
    tracks.push(...tracks);
    return queue;
  }

  public getQueue(message: Message) {
    const queue = this._queus.get(message.guild!.id);
    return queue;
  }

  public _createQueue(message: Message, track: SimpleTrack) {
    return new Promise((resolve, rejects) => {
      const channel = message.member?.voice
        ? message.member.voice.channel
        : null;
      if (!channel)
        return this.emit("error", "NotConnected", message, this._filters);
      const queue = new SimpleQueue(message.guild?.id, message, this._filters);
      this._queus.set(message.guild?.id, queue);
      channel
        .join()
        .then((connection: VoiceConnection) => {
          queue._voiceConnection = connection;
          if (this._options?.autoSelfDeaf) connection.voice.setSelfDeaf(true);
          queue._tracks.push(track);
          this.emit("queueCreate", message, queue);
          resolve(queue);
        })
        .catch((err) => {
          console.error(err);
          this._queus.delete(message.guild?.id);
          this.emit("error", "UnableToJoin", message);
        });
    });
  }

  private async _playTrack(queue: SimpleQueue, firstPlay: any) {
    if (queue._stopped) return;
    if (
      queue._tracks.length === 1 &&
      !queue._loopMode &&
      !queue._repeatMode &&
      !firstPlay
    ) {
      if (this._options?.leaveOnEnd && !queue._stopped) {
        this._queus.delete(queue._guildID);
        const timeout = setTimeout(() => {
          queue._voiceConnection?.channel.leave();
        }, this._options.leaveOnEndCooldown || 0);
        this._cooldownsTimeout.set(`end_${queue._guildID}`, timeout);
      }

      this._queus.delete(queue._guildID);

      if (queue._stopped) {
        return this.emit("musicStop");
      }
      return this.emit("queueEnd", queue._firstMessage, queue);
    }

    if (!queue._repeatMode && !firstPlay) {
      const oldTrack = queue._tracks.shift();
      if (queue._loopMode) queue._tracks.push(oldTrack);
      queue._previousTracks.push(oldTrack);
    }

    const track = queue.playing;
    queue._lastSkipped = false;
  }

  private _playYTDLStream(queue: any, updateFilter: any, seek: any) {
    return new Promise(async (resolve) => {
      const ffmeg = this._util.checkFFMPEG();
      if (!ffmeg) return;
      const seekTime =
        typeof seek === "number"
          ? seek
          : updateFilter
          ? queue.voiceConnection.dispatcher.streamTime +
            queue.additionalStreamTime
          : undefined;
      const encoderArgsFilters: any[] = [];
      Object.keys(queue._filters).forEach((filtername) => {
        if (queue._filters[filtername]) {
        }
      });
      let encorderArgs;
      if (encoderArgsFilters.length < 1) {
        encorderArgs = [];
      } else {
        encorderArgs = ["-af", encoderArgsFilters.join(",")];
      }
      let newStream;
      if (!queue.playing.soundcloud && !queue.playing.arbitary) {
        newStream = ytdl(queue.playing.url, {
          quality:
            this._options?.quality === "low" ? "lowestaudio" : "highestaudio",
          filter: "audioonly",
          opusEncoded: true,
          seek: seekTime / 1000,
          highWaterMark: 1 << 25,
          requestOptions: this._options?.ytdlRequestOptions || {},
        });
      } else {
        newStream = ytdl.arbitraryStream(
          queue.playing.soundcloud
            ? await queue.playing.soundcloud.downloadProgressive()
            : queue.playing.stream,
          {
            opusEncoded: true,
            seek: seekTime / 1000,
          }
        );
      }
    });
  }
}

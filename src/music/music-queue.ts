import { Message, VoiceConnection } from "discord.js";
import EventEmitter from "node:events";
import { Stream } from "node:stream";
import { SimpleTrack } from "./music-track";

export type Filters =
  | "bassboost"
  | "8D"
  | "vaporwave"
  | "nightcore"
  | "phaser"
  | "tremolo"
  | "vibrato"
  | "reverse"
  | "treble"
  | "normalizer"
  | "surrounding"
  | "pulsator"
  | "subboost"
  | "karaoke"
  | "flanger"
  | "gate"
  | "haas"
  | "mcompand"
  | "mono"
  | "mstlr"
  | "mstrr"
  | "compressor"
  | "expander"
  | "softlimiter"
  | "chorus"
  | "chorus2d"
  | "chorus3d"
  | "fadein";

type PlayerFilter = {
  [key in Filters]: string;
};

type FiltersStatuses = {
  [key in Filters]: boolean;
};

interface QueueConfig {
  guildID: string;
  message: Message;
  filter: FiltersStatuses;
}

export class SimpleQueue extends EventEmitter {
  public _guildID: string;
  private _voiceConnection: VoiceConnection;
  private _stream: Stream;
  private _tracks: SimpleTrack[];
  private _previousTracks: SimpleTrack[];
  private _stopped: boolean;
  private _lastSkipped: boolean;
  private _volume: number;
  private _paused: boolean;
  private _repeatMode: boolean;
  private _loopMode: boolean;
  private _filters: FiltersStatuses;
  private _firstMessage: Message;
  private additionalStreamTime: number;

  constructor({ guildID, message, filter }: QueueConfig) {
    super();

    this._guildID = guildID;

    this._filters = filter;

    this._firstMessage = message;
  }

  public playing(): SimpleTrack {
    return this._tracks[0];
  }

  public calculateVolume(): number {
    return this._filters.bassboost ? this._volume + 50 : this._volume;
  }

  public currentStreamTime(): number {
    return this._voiceConnection.dispatcher
      ? this._voiceConnection.dispatcher.streamTime + this.additionalStreamTime
      : 0;
  }
}

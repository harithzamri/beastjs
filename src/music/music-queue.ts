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

export class SimpleQueue extends EventEmitter {
  public _guildID: string | undefined;
  public _voiceConnection: VoiceConnection | null;
  private _stream: Stream;
  public _tracks: SimpleTrack[];
  public _previousTracks: SimpleTrack[];
  public _stopped: boolean;
  public _lastSkipped: boolean;
  private _volume: number;
  private _paused: boolean;
  public _repeatMode: boolean;
  public _loopMode: boolean;
  public _filters: FiltersStatuses;
  public _firstMessage: Message;
  private additionalStreamTime: number;

  constructor(guildID: string | undefined, message: Message, filter: any) {
    super();

    this._guildID = guildID;

    this._filters = filter;

    this._stopped = false;

    this._tracks = [];

    this._previousTracks = [];

    this._voiceConnection = null;

    this._firstMessage = message;
  }

  public playing(): SimpleTrack {
    return this._tracks[0];
  }

  public calculateVolume(): number {
    return this._filters.bassboost ? this._volume + 50 : this._volume;
  }

  public currentStreamTime(): number {
    return this._voiceConnection?.dispatcher
      ? this._voiceConnection.dispatcher.streamTime + this.additionalStreamTime
      : 0;
  }
}

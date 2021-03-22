import { Message, VoiceConnection } from "discord.js";
import EventEmitter from "node:events";
import { Stream } from "node:stream";
import { SimpleTrack } from "./music-track";

type Filters = "bassboost" | "vaporwave";

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
  private _guildID: string;
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

  public calculateVolume(): any {
    return this._filters.bassboost ? this._volume + 50 : this._volume;
  }

  public totalTime(): any {}
}

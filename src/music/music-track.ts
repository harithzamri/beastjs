import { SimpleQueue } from "./music-queue";
import { User } from "discord.js";
import { SimplePlayer } from "./the-real-music-search";

interface VideoData {
  videoData: {
    title: string;
    url: string;
    durationFormatted: number;
    lengthSeconds: string;
  };
  user: User;
  player: SimplePlayer;
}

export class SimpleTrack {
  private _url: string;
  private _duration: number | string;
  private _title: string;
  public requestedBy: User;
  public player: SimplePlayer;

  constructor({ videoData, user, player }: VideoData) {
    this._url = videoData.url;

    this._duration =
      videoData.durationFormatted ||
      `${Math.floor(parseInt(videoData.lengthSeconds) / 60)}:${
        parseInt(videoData.lengthSeconds) % 60
      }`;

    this.requestedBy = user;

    this.player = player;

    this._title = videoData.title;
  }

  public queue(): SimpleQueue {}
}

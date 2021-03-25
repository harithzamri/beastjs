import { User } from "discord.js";
import { SimplePlayer } from "./music-player";

export class SimpleTrack {
  private _url: string;
  private _duration: number | string;
  private _title: string | undefined;
  private _thumbnail: string | undefined;
  public requestedBy: User;
  public player: SimplePlayer;

  constructor(videoData: any, user: User, player: SimplePlayer) {
    this._url = videoData.url;

    this._duration =
      videoData.durationFormatted ||
      `${Math.floor(parseInt(videoData.lengthSeconds) / 60)}:${
        parseInt(videoData.lengthSeconds) % 60
      }`;

    this._thumbnail =
      videoData.thumbnail && typeof videoData.thumbnail === "object"
        ? videoData.thumbnail.url
        : videoData.thumbnail;

    this.requestedBy = user;

    this.player = player;

    this._title = videoData.title;
  }

  // public queue(): SimpleQueue {

  // }
}

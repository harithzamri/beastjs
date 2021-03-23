import { SimpleQueue } from "./music-queue";
import { User } from "discord.js";
import { SimplePlayer } from "./the-real-music-search";
import { Video } from "youtube-sr";

export class SimpleTrack {
  private _url: string;
  private _duration: number | string;
  private _title: string | undefined;
  public requestedBy: User;
  public player: SimplePlayer;

  constructor(videoData: any, user: User, player: SimplePlayer) {
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

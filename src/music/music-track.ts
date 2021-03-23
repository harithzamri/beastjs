import { SimpleQueue } from "./music-queue";
import { User } from "discord.js";
import { SimpleSearch } from "./the-real-music-search";

interface VideoData {
  videoData: any;
  user: User;
  player: SimpleSearch;
}

export class SimpleTrack {
  private _url: string;
  private _duration: number;
  private _title: string;

  constructor({ videoData, user, player }: VideoData) {
    this._url = videoData;

    this._duration =
      videoData.durationFormatted ||
      `${Math.floor(parseInt(videoData.lengthSeconds) / 60)}:${
        parseInt(videoData.lenghtSeconds) % 60
      }`;

    this._title = videoData.title;
  }

  public queue(): SimpleQueue {}
}

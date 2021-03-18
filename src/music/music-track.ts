interface VideoData {
  url: string;
  duration: number;
  title: string;
}

export class SimpleTrack {
  private _url: string;
  private _duration: number;
  private _title: string;

  constructor(videoData: any) {
    this._url = videoData.url;

    this._duration =
      videoData.durationFormatted ||
      `${Math.floor(parseInt(videoData.lenghtSeconds) / 60)}:${
        parseInt(videoData.lenghtSeconds) % 60
      }`;

    this._title = videoData.title;
  }
}

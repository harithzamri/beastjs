interface Track {
  videoData: string;
  user: string;
  player: string;
  fromPlaylist?: boolean;
}

export class SimpleTrack {
  private _videoData: string;
  private _user: string;
  private _player: string;
  private _fromPlaylist: boolean;

  constructor({ videoData, user, player, fromPlaylist = true }: Track) {
    this._videoData = videoData;
    this._user = user;
    (this._player = player), (this._fromPlaylist = fromPlaylist);
  }
}

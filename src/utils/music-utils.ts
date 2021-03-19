import { YouTube } from "youtube-sr";

export class MusicUtils {
  constructor() {}

  public isYTPlaylistLink(query: string) {
    return YouTube.validate(query, "PLAYLIST_ID");
  }

  public isYTVideoLink(query: string) {
    return YouTube.validate(query, "VIDEO");
  }
}

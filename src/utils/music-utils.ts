import { YouTube } from "youtube-sr";

export class MusicUtils {
  constructor() {}

  public isYTPlaylistLink(query: string) {
    return YouTube.validate(query, "PLAYLIST_ID");
  }

  public isYTVideoLink(query: string) {
    return YouTube.validate(query, "VIDEO");
  }

  public isDiscordAttachment(query: string) {
    return /https:\/\/cdn.discordapp.com\/attachments\/(\d{17,19})\/(\d{17,19})\/(.+)/.test(
      query
    );
  }
}

import { YouTube } from "youtube-sr";

export class MusicUtils {
  constructor() {}

  public checkFFMPEG() {
    try {
    } catch (error) {
      this.alertFFMPEG();
      return false;
    }
  }

  public alertFFMPEG() {
    console.log(
      chalk.red("ERROR:"),
      'FFMPEG is not installed. Install with "npm install ffmpeg-static" or download it here: https://ffmpeg.org/download.html.'
    );
  }

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

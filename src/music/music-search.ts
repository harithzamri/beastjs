import { getLogger } from "../utils/logger";
import { YouTube } from "youtube-sr";
import { SimpleTrack } from "./music-track";

const logger = getLogger({
  name: "Beast-Music-Search",
});

export async function searchMusic(): Promise<any> {
  return new Promise(async (resolve) => {
    let tracks: any[] = [];
    await YouTube.search("hello")
      .then((results) => {
        if (results && results.length !== 0) {
          logger.info("Searching for lyrics");
          tracks = results.map((r) => new SimpleTrack(r));
          if (tracks.length === 0) return logger.error("no songs");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return resolve(tracks[0]);
  });
}

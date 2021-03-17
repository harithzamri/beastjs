import { getLogger } from "../utils/logger";
import { YouTube } from "youtube-sr";
import { searchMusic } from "./music-search";

const logger = getLogger({
  name: "Beast-Music-bot",
});

const settings = {
  prefix: "!",
  token: "Your Discord Token",
};

export async function playMusicBot(): Promise<any> {
  await searchMusic();
}

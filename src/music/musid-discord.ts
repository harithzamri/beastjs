import { getLogger } from "../utils/logger";
import { YouTube } from "youtube-sr";

const logger = getLogger({
  name: "Beast-Music-bot",
});

const settings = {
  prefix: "!",
  token: "Your Discord Token",
};

export async function playMusicBot(): Promise<any> {
  YouTube.search("despacito")
    .then((x) => console.log(x))
    .catch(console.error);
}

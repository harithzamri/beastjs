import { getLogger } from "../utils/logger";
import { YouTube } from "youtube-sr";

const logger = getLogger({
  name: "Beast-Music-Search",
});

const settings = {
  prefix: "!",
  token: "Your Discord Token",
};

export async function searchMusic(): Promise<any> {
  let tracks: string[] = [];

  YouTube.search("despacito")
    .then((results) => {
      if (results && results.length !== 0) {
        tracks = results.map((r) => ne);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

import { getLogger } from "../utils/logger";
import { SimplePlayer } from "./the-real-music-search";
import { Client, Message } from "discord.js";

const logger = getLogger({
  name: "Beast-Music-bot",
});

const settings = {
  prefix: "!",
  token: "Your Discord Token",
};

export async function playMusicBot(): Promise<any> {
  const client = new Client();
  const music = new SimplePlayer(client);
  client.on("message", async (message) => {
    if (message.content === "!play") {
      console.log(
        music._handlePlaylist(
          message,
          "https://www.youtube.com/watch?v=rwvF1Lgh61w&list=PLMs24hN-DYLqLDLSjWC2U5HnZaD0mUKyw&index=1"
        )
      );
    }
  });
  client.login(process.env.token);
}

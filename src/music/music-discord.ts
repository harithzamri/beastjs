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
          "https://www.youtube.com/watch?v=SlPhMPnQ58k&list=PL4o29bINVT4EG_y-k5jGoOu3-Am8Nvi10"
        )
      );
    }
  });
  client.login(process.env.token);
}

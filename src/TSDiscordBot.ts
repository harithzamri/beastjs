import dotenv from "dotenv";
import { CommandoClient } from "discord.js-commando";
import * as commands from "./commands";
import * as music from "./music";
import { Player } from "discord-player";
import { Message } from "discord.js";
dotenv.config();

const settings = {
  prefix: "!",
  token: "Your Discord Token",
};

export class TSDiscordBot {
  private client: CommandoClient;

  public start(token: string): void {
    this.client.player = new Player(this.client);
    this.client.player.on("trackStart", (message, track) =>
      message.channel.send(`Now playing ${track.title}...`)
    );

    this.client.on("message", async (message: Message) => {
      const args = message.content
        .slice(settings.prefix.length)
        .trim()
        .split(/ +/g);
      if (args && args.shift()?.toLowerCase()) {
        const command = args.shift()?.toLowerCase();

        if (command === "play") {
          player.play(message, args[0]);
        }
      }
    });

    console.log("Starting bot...");
    this.client = new CommandoClient({
      owner: "117336043119706119",
      commandPrefix: ">",
      messageCacheLifetime: 30,
      messageSweepInterval: 60,
    });

    this.client.on("ready", () => {
      console.log("Starting server...");
    });

    commands.setup(this.client);
    music.setup(this.client);

    this.client.login(token);
  }
}

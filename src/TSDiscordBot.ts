import dotenv from "dotenv";
import { CommandoClient } from "discord.js-commando";
dotenv.config();

export class TSDiscordBot {
  private client: CommandoClient;

  public start(token: string): void {
    console.log("Starting bot...");
    this.client = new CommandoClient({
      owner: "117336043119706119",
      commandPrefix: ">",
      messageCacheLifetime: 30,
      messageSweepInterval: 60,
    });

    this.client.on("ready", () => {
      console.log("The bot is ready!");
      console.log("Starting server...");
    });

    this.client.login(token);
  }
}

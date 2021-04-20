import { Player } from "discord-player";
import { Client as DiscordClient, Message } from "discord.js";
import { pause } from "./pause";
import { play } from "./play";

export class DiscordMusic {
  private _discordClient: DiscordClient;
  private _player: Player;

  public async listen(): Promise<void> {
    this._discordClient.on("message", async (msg: Message) => {
      await play({ msg, player: this._player });

      await pause({ msg, player: this._player });
    });
  }
}

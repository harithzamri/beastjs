import { Message } from "discord.js";
import { PlayConfig } from "./play";

const settings = {
  prefix: "!",
};

export async function pause({ msg, player }: PlayConfig) {
  const args = msg.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (!msg.member?.voice.channel) {
    msg.channel.send("You are not in a voice channel");
  }

  if (
    msg.guild?.me?.voice.channel &&
    msg.member?.voice.channel?.id !== msg.guild.me.voice.channel.id
  ) {
    msg.channel.send("You are not in the same voice channel !");
  }

  if (command === "pause") {
    player.pause(msg);
    msg.channel.send("Now Pausing the song");
  }
}

import { PlayConfig } from "./play";

const settings = {
  prefix: "!",
};

export async function pause({ msg, player }: PlayConfig): Promise<void> {
  const args = msg.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (command === "pause") {
    player.pause(msg);
    msg.channel.send("Now Pausing the song");
  }
}

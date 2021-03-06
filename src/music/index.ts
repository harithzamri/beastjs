import { Player } from "discord-player";
import { Client, Message } from "discord.js";

const settings = {
  prefix: "!",
  token: "Your Discord Token",
};

const handleMusic = (msg: Message) => {
  if (msg.content === "!play") {
    msg.reply("soon gonna reply your song");
  }
};

function setup(client: Client) {
  client.on("message", (msg) => {
    handleMusic(msg);
  });
}

export { setup };

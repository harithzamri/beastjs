import { Client, Message } from "discord.js";

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

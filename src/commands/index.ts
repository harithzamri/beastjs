import { Client, Message } from "discord.js";

const handleMessage = (msg: Message) => {};

function setup(client: Client) {
  client.on("message", (msg) => {
    handleMessage(msg);
  });
}

export { setup };

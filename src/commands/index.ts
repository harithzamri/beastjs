import * as TDiscord from "discord.js";

const client = new TDiscord.Client();

function setup() {
  client.on("ready", () => {
    console.log("I am ready");
  });

  client.on("message", (msg) => {
    if (msg.content === "ping") {
      msg.reply("Pong!");
    }
  });
}

export { setup };

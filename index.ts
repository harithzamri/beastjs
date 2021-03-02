import * as TDiscord from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new TDiscord.Client();
const token = process.env.token;

client.on("ready", () => {
  console.log("I am ready");
});

client.on("message", (message) => {
  if (message.content === "ping") {
    message.channel.send("pong");
  }
});

client.login(token);

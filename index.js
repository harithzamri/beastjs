const Discord = require("discord.js");

const { prefix, token } = require("./config.json");

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready");
});

client.on("message", (message) => {
  message.channel.send("hello").then((message) => console.log(message.content));
});

client.login(token);

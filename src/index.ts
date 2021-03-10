// import { Client } from "discord.js";
// import { Player } from "discord-player";
// import dotenv from "dotenv";
// dotenv.config();

// const client = new Client();
// const player = new Player(client);
// const settings = {
//   prefix: "!",
//   token: "Your Discord Token",
// };

// player.on("trackStart", (message, track) =>
//   message.channel.send(`Now playing ${track.title}...`)
// );

// client.on("ready", () => {
//   console.log("I'm ready !");
// });

// client.on("message", async (message) => {
//   const args = message.content
//     .slice(settings.prefix.length)
//     .trim()
//     .split(/ +/g);
//   const command = args.shift()?.toLowerCase();

//   // !play Despacito
//   // will play "Despacito" in the member voice channel

//   if (command === "play") {
//     console.log("it works");
//     player.play(message, args[0], true).catch((error) => {
//       console.log(error);
//     });
//     // as we registered the event above, no need to send a success message here
//   }
// });

// client.login(process.env.token);

import { TSDiscordBot } from "./TSDiscordBot";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.token;
if (token) {
  const bot: TSDiscordBot = new TSDiscordBot();
  bot.start(token);
}

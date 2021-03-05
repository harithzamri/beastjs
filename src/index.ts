import { TSDiscordBot } from "./TSDiscordBot";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.token;
if (token) {
  const bot: TSDiscordBot = new TSDiscordBot();
  bot.start(token);
}

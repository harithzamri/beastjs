import dotenv from "dotenv";
import { createDiscordClient } from "./discord/discord-bot";
dotenv.config();

async function botServer() {
  const [discordClient, player] = await Promise.all([createDiscordClient()]);
}

void botServer();

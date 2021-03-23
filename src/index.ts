import { Client, Message } from "discord.js";
import dotenv from "dotenv";
import { createDiscordClient } from "./discord/discord-bot";
import { playMusicBot } from "./music/music-discord";
import { Player } from "discord-player";
dotenv.config();

async function botServer() {
  const [discordClient, player] = await Promise.all([
    createDiscordClient(),
    playMusicBot(),
  ]);
}

void botServer();

import dotenv from "dotenv";
import express from "express";
import { createDiscordClient } from "./discord/discord-bot";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

async function botServer() {
  const [discordClient, player] = await Promise.all([createDiscordClient()]);
}

app.get("/", (_req, res) => res.send("hello"));

app.listen(PORT, () => {
  console.log(`Server is listening to port:${PORT}`);
});

void botServer();

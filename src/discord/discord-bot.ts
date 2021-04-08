import Discord from "discord.js";
import type { Client as DiscordClient } from "discord.js";
import { getLogger } from "../utils/logger";
import { DiscordEventManager } from "./discord-event-manager";
import { DISCORD_ROLE_ID } from "src/utils/constants";

const logger = getLogger({
  name: "Beast-bot",
});

export async function createDiscordClientImp(
  resolve: (dc: DiscordClient) => void
): Promise<void> {
  const client = new Discord.Client();

  client.once("ready", async () => {
    logger.info("Discord Client is Ready");

    client.user?.setActivity("Masturbate!");

    const eventManager = new DiscordEventManager({
      discordClient: client,
    });

    await eventManager.listen();

    resolve(client);
  });

  client.on("message", (message) => {
    // eslint-disable-next-line max-len
    logger.debug(
      `[DISCORD MSG] USER:'${message.author.id}' CHANNEL:'${message.channel.id}' CONTENT:'${message.content}'`
    );
    if (message.content === "!ping") {
      void message.channel.send("pong!");
    }
  });

  client.on("guildMemberAdd", function (member) {
    const channel = member.guild.channels.cache.find(
      (channel) => channel.name === "general"
    );
    if (!channel) return;

    const joinembed = new Discord.MessageEmbed()
      .setTitle(`A new member just arrived!`)
      .setDescription(`Welcome ${member} we hope you enjoy your stay here!`)
      .setColor("#FF0000");

    var role = member.guild.roles.cache.get(DISCORD_ROLE_ID.MEMBERS);
    if (role) {
      member.roles.add(role);
    }

    member.send(joinembed);
  });

  client.on("messageUpdate", (oldMessage, newMessage) => {
    const userId = newMessage.author ? newMessage.author.id : "unknown";
    // eslint-disable-next-line max-len
    logger.debug(
      `[DISCORD MSG UPDATE] USER:'${userId}' CHANNEL:'${
        newMessage.channel.id
      }' CONTENT:'${String(newMessage.content)}'`
    );
  });

  const loginResult = await client.login(process.env.token);
  if (loginResult !== process.env.token) {
    logger.warn("login return value does not match");
  }
}

export function createDiscordClient(): Promise<DiscordClient> {
  return new Promise<Discord.Client>((resolve, rejects) => {
    try {
      void createDiscordClientImp(resolve);
    } catch (error) {
      logger.error("Failed to create Discord Client:" + String(error));
      rejects(error);
    }
  });
}

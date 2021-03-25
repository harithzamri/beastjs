import Discord from "discord.js";

const TWITCH_URL = "https://twitch.tv/harithtoikee";
const EMBED_COLOR = "#FDE64B";
const EMBED_AUTHOR = "harithtoikee";

export function getTestEmbed(): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Stream Title Goes Here")
    .setURL(TWITCH_URL)
    .setAuthor("harithtoikee", TWITCH_URL)
    .addFields(
      { name: "Game", value: "Hollow Knight", inline: true },
      { name: "Viewers", value: "69", inline: true }
    )
    .setTimestamp();
}

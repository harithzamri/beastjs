import Discord from "discord.js";

const TWITCH_URL = "https://twitch.tv/harithtoikee";
const EMBED_COLOR = "#FDE64B";
const EMBED_AUTHOR = "harithtoikee";

function randomNumber(min: number, max: number): number {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
}

export function getTestEmbed(): Discord.MessageEmbed {
  return new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("play with anshit")
    .setURL(TWITCH_URL)
    .setAuthor("harithtoikee", TWITCH_URL)
    .addFields(
      { name: "Game", value: "Dota2", inline: true },
      { name: "Viewers", value: "1", inline: true }
    )
    .setTimestamp();
}

interface TwitchStreamEmbedConfig {
  title: string;
  startDate: Date;
  gameName: string;
  thumbnailURL: string;
  boxArtURL: string | null;
}

export function getTwitchStreamEmbed({
  title,
  startDate,
  gameName,
  thumbnailURL,
  boxArtURL,
}: TwitchStreamEmbedConfig) {
  const embedThumbnail = boxArtURL
    ? boxArtURL.replace("{width}", "188").replace("{height}", "250")
    : TWITCH_URL;
  const embedImage = thumbnailURL
    .replace("{width}", "440")
    .replace("{height}", "248");
  const embedImageUrl = `${embedImage}?r=${randomNumber(11111, 99999)}`;
  return new Discord.MessageEmbed()
    .setColor(EMBED_COLOR)
    .setTitle(title)
    .setURL(TWITCH_URL)
    .setAuthor(EMBED_AUTHOR, TWITCH_ICON_URL, TWITCH_URL)
    .setThumbnail(embedThumbnail)
    .addFields({ name: "Game", value: gameName })
    .setImage(embedImageUrl)
    .setTimestamp(startDate);
}

// export function getMusicStreamEmbed(): Discord.MessageEmbed{
//   return new Discord.MessageEmbed{

//   }
// }

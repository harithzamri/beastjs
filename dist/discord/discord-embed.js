"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMusicStreamEmbed = exports.getTwitchStreamEmbed = exports.getTestEmbed = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const TWITCH_URL = "https://twitch.tv/harithtoikee";
const EMBED_COLOR = "#FDE64B";
const EMBED_AUTHOR = "harithtoikee";
function randomNumber(min, max) {
    const r = Math.random() * (max - min) + min;
    return Math.floor(r);
}
function getTestEmbed() {
    return new discord_js_1.default.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("play with anshit")
        .setURL(TWITCH_URL)
        .setAuthor("harithtoikee", TWITCH_URL)
        .addFields({ name: "Game", value: "Dota2", inline: true }, { name: "Viewers", value: "1", inline: true })
        .setTimestamp();
}
exports.getTestEmbed = getTestEmbed;
function getTwitchStreamEmbed({ title, startDate, gameName, thumbnailURL, boxArtURL, }) {
    const embedThumbnail = boxArtURL
        ? boxArtURL.replace("{width}", "188").replace("{height}", "250")
        : TWITCH_URL;
    const embedImage = thumbnailURL
        .replace("{width}", "440")
        .replace("{height}", "248");
    const embedImageUrl = `${embedImage}?r=${randomNumber(11111, 99999)}`;
    return new discord_js_1.default.MessageEmbed()
        .setColor(EMBED_COLOR)
        .setTitle(title)
        .setURL(TWITCH_URL)
        .setAuthor(EMBED_AUTHOR, TWITCH_URL)
        .setThumbnail(embedThumbnail)
        .addFields({ name: "Game", value: gameName })
        .setImage(embedImageUrl)
        .setTimestamp(startDate);
}
exports.getTwitchStreamEmbed = getTwitchStreamEmbed;
function getMusicStreamEmbed({ title, duration, thumbnailUrl, url, requestedBy, }) {
    return new discord_js_1.default.MessageEmbed()
        .setColor("#DC143C")
        .setTitle("Now Playing 🎶")
        .setDescription(title)
        .setURL(url)
        .setThumbnail(thumbnailUrl)
        .addFields({ name: "Length", value: duration }, { name: "Requested By", value: requestedBy })
        .setTimestamp(Date.now());
}
exports.getMusicStreamEmbed = getMusicStreamEmbed;
//# sourceMappingURL=discord-embed.js.map
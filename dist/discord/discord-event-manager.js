"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordEventManager = void 0;
const discord_player_1 = require("discord-player");
const logger_1 = require("../utils/logger");
const ytdl_core_1 = require("ytdl-core");
const discord_embed_1 = require("./discord-embed");
const settings = {
    prefix: "?",
};
class DiscordEventManager {
    constructor({ discordClient }) {
        this._discordClient = discordClient;
        this._logger = logger_1.getLogger({ name: "beast-discord-event-manager" });
        this._player = new discord_player_1.Player(this._discordClient);
        this._player.on("trackStart", (message, track) => message.channel.send(`Now playing ${track.title}...`));
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Listening to events");
            this._discordClient.on("debug", (msg) => {
                const message = `[cllient debug] ${msg}`;
                this._logger.debug(message);
            });
            this._discordClient.on("message", (msg) => {
                if (msg.content === "!latency") {
                    msg.channel.send(`Latency for this server is ${Date.now() - msg.createdTimestamp}ms `);
                }
            });
            this._discordClient.on("message", (msg) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const args = msg.content
                    .slice(settings.prefix.length)
                    .trim()
                    .split(/ +/g);
                const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                if (command === "play") {
                    this._player.play(msg, args[0], true);
                }
                yield ytdl_core_1.getBasicInfo(args[0])
                    .then((videoUrlData) => {
                    const { title, url, duration, thumbnail } = new discord_player_1.Track({
                        title: videoUrlData.videoDetails.title,
                        url: videoUrlData.videoDetails.video_url,
                        views: videoUrlData.videoDetails.viewCount,
                        thumbnail: videoUrlData.videoDetails.thumbnails[0],
                        lengthSeconds: videoUrlData.videoDetails.lengthSeconds,
                        description: videoUrlData.videoDetails.description,
                        author: {
                            name: videoUrlData.videoDetails.author.name,
                        },
                    }, msg.author, this._player);
                    msg.channel.send(discord_embed_1.getMusicStreamEmbed({
                        title,
                        duration,
                        url,
                        thumbnailUrl: thumbnail,
                        requestedBy: msg.author.username,
                    }));
                })
                    .catch((error) => { });
            }));
            this._discordClient.on("message", (msg) => {
                if (msg.content === "!pause") {
                    this._player.pause(msg);
                    msg.channel.send("Now Pausing the song");
                }
            });
            this._discordClient.on("message", (msg) => {
                if (msg.content === "!resume") {
                    this._player.resume(msg);
                    msg.channel.send("Resuming the song");
                }
            });
            this._discordClient.on("message", (msg) => {
                if (msg.content === "!greetings") {
                    msg.channel.send(`Hi Bitch <@${msg.author.id}>`);
                }
            });
        });
    }
}
exports.DiscordEventManager = DiscordEventManager;
//# sourceMappingURL=discord-event-manager.js.map
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
exports.playMusicBot = void 0;
const logger_1 = require("../utils/logger");
const music_player_1 = require("./music-player");
const discord_js_1 = require("discord.js");
const logger = logger_1.getLogger({
    name: "Beast-Music-bot",
});
const settings = {
    prefix: "!",
    token: "Your Discord Token",
};
function playMusicBot() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new discord_js_1.Client();
        const music = new music_player_1.SimplePlayer(client);
        client.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
            if (message.content === "test") {
                console.log(music._handlePlaylist(message, "https://www.youtube.com/watch?v=rwvF1Lgh61w&list=PLMs24hN-DYLqLDLSjWC2U5HnZaD0mUKyw&index=1"));
            }
        }));
        client.login(process.env.token);
    });
}
exports.playMusicBot = playMusicBot;
//# sourceMappingURL=music-discord.js.map
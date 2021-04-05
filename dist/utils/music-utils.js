"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicUtils = void 0;
const youtube_sr_1 = require("youtube-sr");
const chalk_1 = __importDefault(require("chalk"));
const prism_media_1 = __importDefault(require("prism-media"));
class MusicUtils {
    constructor() { }
    checkFFMPEG() {
        try {
            prism_media_1.default.FFmpeg.getInfo();
            return true;
        }
        catch (error) {
            this.alertFFMPEG();
            return false;
        }
    }
    alertFFMPEG() {
        console.log(chalk_1.default.red("ERROR:"), 'FFMPEG is not installed. Install with "npm install ffmpeg-static" or download it here: https://ffmpeg.org/download.html.');
    }
    isYTPlaylistLink(query) {
        return youtube_sr_1.YouTube.validate(query, "PLAYLIST_ID");
    }
    isYTVideoLink(query) {
        return youtube_sr_1.YouTube.validate(query, "VIDEO");
    }
    isDiscordAttachment(query) {
        return /https:\/\/cdn.discordapp.com\/attachments\/(\d{17,19})\/(\d{17,19})\/(.+)/.test(query);
    }
}
exports.MusicUtils = MusicUtils;
//# sourceMappingURL=music-utils.js.map
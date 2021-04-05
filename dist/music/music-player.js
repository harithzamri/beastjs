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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplePlayer = void 0;
const discord_ytdl_core_1 = __importDefault(require("discord-ytdl-core"));
const discord_js_1 = require("discord.js");
const events_1 = __importDefault(require("events"));
const logger_1 = require("../utils/logger");
const music_utils_1 = require("../utils/music-utils");
const music_queue_1 = require("./music-queue");
const music_track_1 = require("./music-track");
const youtube_sr_1 = require("youtube-sr");
const filters = {
    bassboost: "bass=g=20",
    "8D": "apulsator=hz=0.09",
    vaporwave: "aresample=48000,asetrate=48000*0.8",
    nightcore: "aresample=48000,asetrate=48000*1.25",
    phaser: "aphaser=in_gain=0.4",
    tremolo: "tremolo",
    vibrato: "vibrato=f=6.5",
    reverse: "areverse",
    treble: "treble=g=5",
    normalizer: "dynaudnorm=g=101",
    surrounding: "surround",
    pulsator: "apulsator=hz=1",
    subboost: "asubboost",
    karaoke: "stereotools=mlev=0.03",
    flanger: "flanger",
    gate: "agate",
    haas: "haas",
    mcompand: "mcompand",
    mono: "pan=mono|c0=.5*c0+.5*c1",
    mstlr: "stereotools=mode=ms>lr",
    mstrr: "stereotools=mode=ms>rr",
    compressor: "compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6",
    expander: "compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3",
    softlimiter: "compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8",
    chorus: "chorus=0.7:0.9:55:0.4:0.25:2",
    chorus2d: "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3",
    chorus3d: "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
    fadein: "afade=t=in:ss=0:d=10",
};
class SimplePlayer extends events_1.default {
    constructor(discordClient, options) {
        super();
        this._cooldownsTimeout = new discord_js_1.Collection();
        this._queus = new discord_js_1.Collection();
        this._discordClient = discordClient;
        this._options = options;
        this._logger = logger_1.getLogger({
            name: "beast-bot-searching-tracks",
        });
        this._util = new music_utils_1.MusicUtils();
        this._filters = filters;
    }
    isPlaying(message) {
        return this._queus.some((g) => { var _a; return g._guildID === ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id); });
    }
    play(message, query, _firstResult, isAttachment) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (this._cooldownsTimeout.has(`end_${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}`)) {
                clearTimeout(this._cooldownsTimeout.get(`end_${(_b = message.guild) === null || _b === void 0 ? void 0 : _b.id}`));
                this._cooldownsTimeout.delete(`end_${(_c = message.guild) === null || _c === void 0 ? void 0 : _c.id}`);
            }
            if (!query || typeof query !== "string")
                throw new Error("Play function requires search query but received none!");
            query = query.replace(/<(.+)>/g, "$1");
            if (!this._util.isDiscordAttachment(query) &&
                !isAttachment &&
                this._util.isYTPlaylistLink(query)) {
            }
        });
    }
    _handlePlaylist(message, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var duration;
            this.emit("playlistParseStart", {}, message);
            const playlist = yield youtube_sr_1.YouTube.getPlaylist(query);
            if (!playlist)
                return this.emit("noResults", message, query);
            let tracks = playlist.videos.map((item) => new music_track_1.SimpleTrack(item, message.author, this));
            duration = tracks.reduce((prev, next) => prev + next._duration, 0);
            let thumbnail = tracks[0]._thumbnail;
            let requestedBy = message.author;
            this.emit("playlistParseEnd", playlist, message);
            if (this.isPlaying(message)) {
                const queue = this._addTracksToQueue(message, tracks);
                this.emit("playlistAdd", message, queue, playlist);
            }
            else {
                const track = tracks.shift();
            }
            return true;
        });
    }
    _addTracksToQueue(message, tracks) {
        const queue = this.getQueue(message);
        if (!queue)
            throw new Error("cannot add tracks to queue");
        tracks.push(...tracks);
        return queue;
    }
    getQueue(message) {
        const queue = this._queus.get(message.guild.id);
        return queue;
    }
    _createQueue(message, track) {
        return new Promise((resolve, rejects) => {
            var _a, _b, _c;
            const channel = ((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice)
                ? message.member.voice.channel
                : null;
            if (!channel)
                return this.emit("error", "NotConnected", message, this._filters);
            const queue = new music_queue_1.SimpleQueue((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id, message, this._filters);
            this._queus.set((_c = message.guild) === null || _c === void 0 ? void 0 : _c.id, queue);
            channel
                .join()
                .then((connection) => {
                var _a;
                queue._voiceConnection = connection;
                if ((_a = this._options) === null || _a === void 0 ? void 0 : _a.autoSelfDeaf)
                    connection.voice.setSelfDeaf(true);
                queue._tracks.push(track);
                this.emit("queueCreate", message, queue);
                resolve(queue);
            })
                .catch((err) => {
                var _a;
                console.error(err);
                this._queus.delete((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id);
                this.emit("error", "UnableToJoin", message);
            });
        });
    }
    _playTrack(queue, firstPlay) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (queue._stopped)
                return;
            if (queue._tracks.length === 1 &&
                !queue._loopMode &&
                !queue._repeatMode &&
                !firstPlay) {
                if (((_a = this._options) === null || _a === void 0 ? void 0 : _a.leaveOnEnd) && !queue._stopped) {
                    this._queus.delete(queue._guildID);
                    const timeout = setTimeout(() => {
                        var _a;
                        (_a = queue._voiceConnection) === null || _a === void 0 ? void 0 : _a.channel.leave();
                    }, this._options.leaveOnEndCooldown || 0);
                    this._cooldownsTimeout.set(`end_${queue._guildID}`, timeout);
                }
                this._queus.delete(queue._guildID);
                if (queue._stopped) {
                    return this.emit("musicStop");
                }
                return this.emit("queueEnd", queue._firstMessage, queue);
            }
            if (!queue._repeatMode && !firstPlay) {
                const oldTrack = queue._tracks.shift();
                if (queue._loopMode)
                    queue._tracks.push(oldTrack);
                queue._previousTracks.push(oldTrack);
            }
            const track = queue.playing;
            queue._lastSkipped = false;
        });
    }
    _playYTDLStream(queue, updateFilter, seek) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const ffmeg = this._util.checkFFMPEG();
            if (!ffmeg)
                return;
            const seekTime = typeof seek === "number"
                ? seek
                : updateFilter
                    ? queue.voiceConnection.dispatcher.streamTime +
                        queue.additionalStreamTime
                    : undefined;
            const encoderArgsFilters = [];
            Object.keys(queue._filters).forEach((filtername) => {
                if (queue._filters[filtername]) {
                }
            });
            let encorderArgs;
            if (encoderArgsFilters.length < 1) {
                encorderArgs = [];
            }
            else {
                encorderArgs = ["-af", encoderArgsFilters.join(",")];
            }
            let newStream;
            if (!queue.playing.soundcloud && !queue.playing.arbitary) {
                newStream = discord_ytdl_core_1.default(queue.playing.url, {
                    quality: ((_a = this._options) === null || _a === void 0 ? void 0 : _a.quality) === "low" ? "lowestaudio" : "highestaudio",
                    filter: "audioonly",
                    opusEncoded: true,
                    seek: seekTime / 1000,
                    highWaterMark: 1 << 25,
                    requestOptions: ((_b = this._options) === null || _b === void 0 ? void 0 : _b.ytdlRequestOptions) || {},
                });
            }
            else {
                newStream = discord_ytdl_core_1.default.arbitraryStream(queue.playing.soundcloud
                    ? yield queue.playing.soundcloud.downloadProgressive()
                    : queue.playing.stream, {
                    opusEncoded: true,
                    seek: seekTime / 1000,
                });
            }
        }));
    }
}
exports.SimplePlayer = SimplePlayer;
//# sourceMappingURL=music-player.js.map
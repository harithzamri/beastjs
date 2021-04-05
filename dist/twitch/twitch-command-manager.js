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
exports.TwitchManagerConfig = void 0;
const logger_1 = require("../utils/logger");
const simple_twitch_bot_1 = require("./simple-twitch-bot");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
function durationInEnglish(duration) {
    return humanize_duration_1.default(duration, {
        units: ["y", "mo", "w", "d", "h", "m"],
        round: true,
    });
}
const COMMAND_PREFIX = "hello";
class TwitchManagerConfig {
    constructor({ apiClient, chatClient }) {
        this._apiClient = apiClient;
        this._chatClient = chatClient;
        this._logger = logger_1.getLogger({
            name: "beast-js-bot",
        });
        this._simpleTwitchBot = new simple_twitch_bot_1.SimpleTwitchBot({
            chatClient: this._chatClient,
            commandPrefix: COMMAND_PREFIX,
        });
        this.initCommands();
    }
    initCommands() {
        this._simpleTwitchBot.addCommand("!ping", (params, context) => __awaiter(this, void 0, void 0, function* () {
            context.say("!pong");
        }));
        this._simpleTwitchBot.addCommand("followage", (params, context) => __awaiter(this, void 0, void 0, function* () {
            const follow = yield this._apiClient.kraken.users.getFollowedChannel(context.msg.userInfo.userId, context.msg.channelId);
            if (follow) {
                const followDate = follow.followDate;
                const duration = new Date().getTime() - followDate.getTime();
                const durationEnglish = durationInEnglish(duration);
                context.say(`@${context.user} You have been following for ${durationEnglish}`);
            }
            else {
                context.say(`@${context.user} You are not following`);
            }
        }));
        this._simpleTwitchBot.addCommand("!uptime", (params, context) => __awaiter(this, void 0, void 0, function* () {
            const stream = yield this._apiClient.helix.streams.getStreamByUserName("harithtoikee");
            if (!stream) {
                context.say("Stream is live, but I failed to fetch stream data :(");
                return;
            }
            const duration = new Date().getTime() - stream.startDate.getTime();
            const durationEnglish = durationInEnglish(duration);
            context.say(`Stream has been live fro ${durationEnglish}`);
        }), {
            cooldown: {
                time: 1000,
                reply: false,
            },
        });
        this._simpleTwitchBot.addCommand("!record", (params, context) => __awaiter(this, void 0, void 0, function* () { }));
    }
}
exports.TwitchManagerConfig = TwitchManagerConfig;
//# sourceMappingURL=twitch-command-manager.js.map
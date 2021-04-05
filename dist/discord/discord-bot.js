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
exports.createDiscordClient = exports.createDiscordClientImp = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const logger_1 = require("../utils/logger");
const discord_event_manager_1 = require("./discord-event-manager");
const logger = logger_1.getLogger({
    name: "Beast-bot",
});
function createDiscordClientImp(resolve) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new discord_js_1.default.Client();
        client.once("ready", () => __awaiter(this, void 0, void 0, function* () {
            logger.info("Discord Client is Ready");
            const eventManager = new discord_event_manager_1.DiscordEventManager({
                discordClient: client,
            });
            yield eventManager.listen();
            resolve(client);
        }));
        client.on("message", (message) => {
            logger.debug(`[DISCORD MSG] USER:'${message.author.id}' CHANNEL:'${message.channel.id}' CONTENT:'${message.content}'`);
            if (message.content === "!ping") {
                void message.channel.send("pong!");
            }
        });
        client.on("messageUpdate", (oldMessage, newMessage) => {
            const userId = newMessage.author ? newMessage.author.id : "unknown";
            logger.debug(`[DISCORD MSG UPDATE] USER:'${userId}' CHANNEL:'${newMessage.channel.id}' CONTENT:'${String(newMessage.content)}'`);
        });
        const loginResult = yield client.login(process.env.token);
        if (loginResult !== process.env.token) {
            logger.warn("login return value does not match");
        }
    });
}
exports.createDiscordClientImp = createDiscordClientImp;
function createDiscordClient() {
    return new Promise((resolve, rejects) => {
        try {
            void createDiscordClientImp(resolve);
        }
        catch (error) {
            logger.error("Failed to create Discord Client:" + String(error));
            rejects(error);
        }
    });
}
exports.createDiscordClient = createDiscordClient;
//# sourceMappingURL=discord-bot.js.map
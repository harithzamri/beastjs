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
exports.SimpleTwitchBot = void 0;
const easy_twitch_bot_1 = require("easy-twitch-bot");
const logger_1 = require("../utils/logger");
const time_utils_1 = require("../utils/time-utils");
class SimpleTwitchBot {
    constructor({ chatClient, commandPrefix }) {
        this._commands = new Map();
        this._commandLastUsed = new Map();
        this._chatClient = chatClient;
        this._commandPrefix = commandPrefix;
        this._logger = logger_1.getLogger({
            name: "simple-twitch-bot",
        });
    }
    addCommand(commandName, handler, options) {
        const metaHandler = this._createMetaHandler(commandName, handler, options);
        const command = easy_twitch_bot_1.createBotCommand(commandName, metaHandler);
        this._commands.set(commandName, command);
        this._logger.info(`Command removed: ${commandName}`);
    }
    removeCommand(commandName) {
        this._commands.delete(commandName);
        this._logger.info(`Command Removed: ${commandName}`);
    }
    listen() {
        this._chatClient.onMessage((channel, user, message, msg) => __awaiter(this, void 0, void 0, function* () {
            const match = this._findMatch(msg);
            if (match === null) {
                return;
            }
            const commandText = new easy_twitch_bot_1.BotCommandContext(this._chatClient, msg);
            try {
                this._logger.info("Executing command :" + match.command.name);
                yield match.command.execute(match.params, commandText);
            }
            catch (e) {
                const errMsg = `${match.command.name} command failed`;
                this._logger.error(`${errMsg}:` + String(e));
                commandText.say(errMsg);
            }
        }));
    }
    _createMetaHandler(commandName, handler, options) {
        return (params, context) => {
            if (!options) {
                return handler(params, context);
            }
            const user = context.msg.userInfo;
            const userDisplayName = user.displayName;
            if (options.permissions) {
                const allowedOptions = [
                    options.permissions.broadcaster && user.isBroadcaster,
                    options.permissions.founder && user.isFounder,
                    options.permissions.mod && user.isMod,
                    options.permissions.subscriber && user.isSubscriber,
                    options.permissions.vip && user.isVip,
                ];
                this._logger.debug("allowed options:" + allowedOptions.join(" "));
                const allowed = allowedOptions.some((option) => option);
                this._logger.info("allowed = " + String(allowed));
                if (!allowed) {
                    context.say(`@${userDisplayName} you are not allowed to use ${commandName}`);
                    return;
                }
            }
            if (options.cooldown) {
                const commandLastUsed = this._commandLastUsed.get(commandName);
                const isRefreshed = time_utils_1.refreshed(commandLastUsed, options.cooldown.time);
                if (!isRefreshed) {
                    if (options.cooldown.reply) {
                        context.say(`@${userDisplayName}, ${commandName} is still on cooldown`);
                    }
                    return;
                }
                this._commandLastUsed.set(commandName, new Date());
            }
            return handler(params, context);
        };
    }
    _findMatch(msg) {
        const line = msg.params.message.trim().replace(/  +/g, " ");
        for (const command of this._commands.values()) {
            const params = command.match(line, this._commandPrefix);
            if (params !== null) {
                return {
                    command,
                    params,
                };
            }
        }
        return null;
    }
}
exports.SimpleTwitchBot = SimpleTwitchBot;
//# sourceMappingURL=simple-twitch-bot.js.map
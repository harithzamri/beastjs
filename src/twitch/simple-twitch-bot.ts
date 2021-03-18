import type { ChatClient, PrivateMessage } from "twitch-chat-client";
import {
  BotCommand,
  BotCommandContext,
  createBotCommand,
} from "easy-twitch-bot";
import type { Logger } from "@d-fischer/logger";
import { getLogger } from "src/utils/logger";

export interface SimpleTwitchConfig {
  chatClient: ChatClient;
  commandPrefix: string;
}

export type CommandHandler = (
  params: string[],
  context: BotCommandContext
) => void | Promise<void>;

export interface CommandPermission {
  broadcaster: boolean;
  founder: boolean;
  mod: boolean;
  subscriber: boolean;
  vip: boolean;
}

export interface CommandOption {
  cooldown?: {
    time: number;
    reply: boolean;
  };
  permission?: CommandPermission;
}

export class SimpleTwitchBot {
  private _chatClient: ChatClient;
  private _commandPrefix: string;
  private _commands = new Map<string, BotCommand>();
  private _commandLastUsed = new Map<string, Date>();
  private _logger: Logger;

  constructor({ chatClient, commandPrefix }: SimpleTwitchConfig) {
    this._chatClient = chatClient;
    this._commandPrefix = commandPrefix;

    this._logger = getLogger({
      name: "simple-twitch-bot",
    });
  }

  public addCommand(commandName: string, handler: CommandHandler){}
}

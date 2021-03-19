import type { Client as DiscordClient } from "discord.js";
import { Logger } from "@d-fischer/logger";
import EventEmitter from "node:events";
import { getLogger } from "src/utils/logger";
import { MusicUtils } from "../utils/music-utils";

export interface DiscordConfig {
  discordClient: DiscordClient;
  options: {};
}

class PlayerSearch extends EventEmitter {
  private _discordClient: DiscordClient;
  private _logger: Logger;
  private _options: {};
  private _util: MusicUtils;

  constructor({ discordClient, options }: DiscordConfig) {
    super();

    this._discordClient = discordClient;
    this._options = options;

    this._logger = getLogger({
      name: "beast-bot-searching-tracks",
    });

    this._util = new MusicUtils;
    
  }
}

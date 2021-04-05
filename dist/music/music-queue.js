"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleQueue = void 0;
const node_events_1 = __importDefault(require("node:events"));
class SimpleQueue extends node_events_1.default {
    constructor(guildID, message, filter) {
        super();
        this._guildID = guildID;
        this._filters = filter;
        this._stopped = false;
        this._tracks = [];
        this._previousTracks = [];
        this._voiceConnection = null;
        this._firstMessage = message;
    }
    playing() {
        return this._tracks[0];
    }
    calculateVolume() {
        return this._filters.bassboost ? this._volume + 50 : this._volume;
    }
    currentStreamTime() {
        var _a;
        return ((_a = this._voiceConnection) === null || _a === void 0 ? void 0 : _a.dispatcher)
            ? this._voiceConnection.dispatcher.streamTime + this.additionalStreamTime
            : 0;
    }
}
exports.SimpleQueue = SimpleQueue;
//# sourceMappingURL=music-queue.js.map
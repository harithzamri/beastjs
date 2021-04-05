"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTrack = void 0;
class SimpleTrack {
    constructor(videoData, user, player) {
        this._url = videoData.url;
        this._duration =
            videoData.durationFormatted ||
                `${Math.floor(parseInt(videoData.lengthSeconds) / 60)}:${parseInt(videoData.lengthSeconds) % 60}`;
        this._thumbnail =
            videoData.thumbnail && typeof videoData.thumbnail === "object"
                ? videoData.thumbnail.url
                : videoData.thumbnail;
        this.requestedBy = user;
        this.player = player;
        this._title = videoData.title;
    }
}
exports.SimpleTrack = SimpleTrack;
//# sourceMappingURL=music-track.js.map
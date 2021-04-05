"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshed = void 0;
function refreshed(lastUse, cooldownMs) {
    if (!lastUse) {
        return true;
    }
    return Number(new Date()) - Number(lastUse) > cooldownMs;
}
exports.refreshed = refreshed;
//# sourceMappingURL=time-utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const logger_1 = require("@d-fischer/logger");
function getLogger({ name }) {
    return new logger_1.Logger({
        name,
        minLevel: logger_1.LogLevel.DEBUG,
        colors: true,
        emoji: true,
        timestamps: true,
    });
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map
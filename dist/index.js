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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const discord_bot_1 = require("./discord/discord-bot");
dotenv_1.default.config();
const app = express_1.default();
const PORT = process.env.PORT || 4000;
function botServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const [discordClient, player] = yield Promise.all([discord_bot_1.createDiscordClient()]);
    });
}
app.get("/", (_req, res) => res.send("hello"));
app.listen(PORT, () => {
    console.log(`Server is listening to port:${PORT}`);
});
void botServer();
//# sourceMappingURL=index.js.map
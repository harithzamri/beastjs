"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const handleMessage = (message) => {
    const guild = message.guild;
    console.log(guild);
};
function setup(client) {
    client.on("message", (msg) => {
        void handleMessage(msg);
    });
}
exports.setup = setup;
//# sourceMappingURL=index.js.map
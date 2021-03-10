import * as TSDiscord from "discord.js";

const handleMessage = (message: TSDiscord.Message) => {
  const guild = message.guild;
  console.log(guild);
};

function setup(client: TSDiscord.Client) {
  client.on("message", (msg) => {
    void handleMessage(msg);
  });
}

export { setup };

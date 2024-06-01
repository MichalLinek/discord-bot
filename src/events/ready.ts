import { Events } from "discord.js";
import { SoundBotClient } from "src/utils/sound-bot.client";

export default {
  name: Events.ClientReady,
  execute: async (client: SoundBotClient) => {
    console.log("Deploying commands...");
    await client.deployCommands();
    console.log("Ready");
  },
};

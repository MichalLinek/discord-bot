import { CommandInteraction, Events } from "discord.js";
import { SoundBotClient } from "src/utils/sound-bot.client";
import handleCommand from "../utils/handle-command";

export default {
  name: Events.InteractionCreate,
  execute: (client: SoundBotClient, interaction: CommandInteraction) => {
    if ((interaction as any).isButton()) {
      const client: SoundBotClient = (interaction as any).client;
      client.joinChannel(interaction);
      client.playSound(interaction, (interaction as any).customId as string);
      (interaction as any).deferUpdate();
    }
    if (interaction.isAutocomplete()) {
      const command = client.commands.get((interaction as any).commandName);
      if (!command) return;
      try {
        (command as any).autocomplete(interaction);
      } catch (ex) {
        return;
      }
    } else if (interaction.isCommand()) {
      handleCommand(client, interaction);
    }
  },
};

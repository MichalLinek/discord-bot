import { SlashCommandBuilder } from "@discordjs/builders";
import { searchButtons } from "../search-buttons";
import { data } from "../utils/soundDb";
import { SoundBotClient } from "src/utils/sound-bot.client";

export default {
  data: new SlashCommandBuilder()
    .addStringOption(
      (option) =>
        option.setName("query").setDescription("Input a text").setRequired(true)
      //  .setAutocomplete(true)
    )
    .setName("search")
    .setDescription("Search in the entire DB"),

  async run(interaction: any) {
    const { options } = interaction;
    const client: SoundBotClient = interaction.client;

    const phrase = options.data[0]?.value as string;

    const foundItems = searchButtons(data, phrase);
    if (foundItems[0].components?.length === 1) {
      const file = foundItems[0].components[0]["custom_id"];
      client.playSound(interaction, file);
      const fileName = file.substring(file.lastIndexOf("\\") + 1);

      await interaction.reply({
        content: `Playing ${fileName}`,
        ephemeral: true,
      });
    } else if (foundItems[0].components?.length > 1) {
      await interaction.reply({
        ephemeral: true,
        content: `Search results of phrase **${phrase}**:`,
        components: foundItems,
      });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `No items found for **${phrase}**, try to use different phrase`,
      });
    }
  },
};

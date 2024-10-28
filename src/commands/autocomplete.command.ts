import { SlashCommandBuilder } from "@discordjs/builders";
import { SoundBotClient } from "src/utils/sound-bot.client";
import { autocompleteOptions } from "../autocomplete-options";
import { data } from "../utils/soundDb";

export default {
  data: new SlashCommandBuilder()
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Input a text")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .setName("find")
    .setDescription("Search in the entire DB"),
  async autocomplete(interaction: any) {
    const phrase = interaction.options.getString("query");
    const values = autocompleteOptions(data, phrase);
    await interaction.respond(values);
  },
  async run(interaction: any) {
    const { options } = interaction;
    const client: SoundBotClient = interaction.client;
    const filePath = options.data[0].value;

    client.playSound(interaction, filePath);
    
    const fileName = filePath.substring(filePath.lastIndexOf("\\") + 1);

    await interaction.reply({
      content: `Playing ${fileName}`,
      ephemeral: true,
    });
  },
};

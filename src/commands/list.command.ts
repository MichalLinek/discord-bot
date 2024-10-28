import { SlashCommandBuilder } from "@discordjs/builders";
import { createButtons } from "../create-buttons";
import { createOptions } from "../create-options";
import { data } from "./../utils/soundDb";

export default {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Displays available sounds grouped by folder")
    .addStringOption((option) =>
      option
        .setName("folder")
        .setDescription("Folder containing the files to play")
        .setRequired(true)
        .addChoices(...createOptions(data))
    ),
  async run(interaction: any) {
    const { options } = interaction;

    const key = options.data[0]?.value as string;
    await interaction.reply({
      ephemeral: true,
      content: `Sounds from **${key}**:`,
      components: createButtons(data, key),
    });
  },
};

import { SlashCommandBuilder } from "@discordjs/builders";
import { createRandomButtons } from "../../src/create-random-buttons";
import { data } from "./../utils/soundDb";

export default {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Show random files"),

  async run(interaction: any) {
    await interaction.reply({
      ephemeral: true,
      content: `Random list of files:`,
      components: createRandomButtons(data),
    });
  },
};

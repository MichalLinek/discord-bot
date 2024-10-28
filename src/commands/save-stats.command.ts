import { SlashCommandBuilder } from "@discordjs/builders";
import { SoundBotClient } from "src/utils/sound-bot.client";

export default {
  data: new SlashCommandBuilder()
    .setName("save-statistics")
    .setDescription("Save statistics about the files played"),

  async run(interaction: any) {
    const client: SoundBotClient = interaction.client;
    if (process.env.ADMIN_ID === interaction.user.id) {
      client.saveStatistics = true;
      await interaction.reply({
        content: "Statistics enabled",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Permissions required",
        ephemeral: true,
      });
    }
  },
};

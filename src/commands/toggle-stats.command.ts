import { SlashCommandBuilder } from "@discordjs/builders";
import { SoundBotClient } from "src/utils/sound-bot.client";

export default {
  data: new SlashCommandBuilder()
    .setName("toggle-statistics")
    .setDescription("Toggles statistics options - read/write to stats data"),

  async run(interaction: any) {
    const client: SoundBotClient = interaction.client;
    if (process.env.ADMIN_ID === interaction.user.id) {
      client.useStatistics = !client.useStatistics;
      await interaction.reply({
        content: client.useStatistics
          ? "Statistics enabled"
          : "Statistics disabled",
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

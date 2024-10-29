import { SlashCommandBuilder } from "@discordjs/builders";
import { StatsService } from "../utils/stats.service";
import { changeArrayToRowOfButtons } from "../../src/change-array-to-row-of-buttons";
import { SoundBotClient } from "../../src/utils/sound-bot.client";

export default {
  data: new SlashCommandBuilder()
    .setName("popular")
    .setDescription("Show most used files by all users"),

  async run(interaction: any) {
    if (!(interaction.client as SoundBotClient).useStatistics) {
      await interaction.reply({
        ephemeral: true,
        content: `Statistics are disabled - use toggle-statistics to change the settings`,
      });
      return;
    }
    const service = new StatsService();
    const files = await service.getMostPopularFiles();
    if (files?.length) {
      await interaction.reply({
        ephemeral: true,
        content: `The most popular files:`,
        components: changeArrayToRowOfButtons(files),
      });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `No file has been played yet`,
      });
    }
  },
};

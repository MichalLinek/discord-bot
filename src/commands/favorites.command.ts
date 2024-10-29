import { SlashCommandBuilder } from "@discordjs/builders";
import { changeArrayToRowOfButtons } from "../../src/change-array-to-row-of-buttons";
import { StatsService } from "../utils/stats.service";
import { SoundBotClient } from "../../src/utils/sound-bot.client";

export default {
  data: new SlashCommandBuilder()
    .setName("favorites")
    .setDescription("Show most used files by given user"),

  async run(interaction: any) {
    if (!(interaction.client as SoundBotClient).useStatistics) {
      await interaction.reply({
        ephemeral: true,
        content: `Statistics are disabled - use toggle-statistics to change the settings`,
      });
      return;
    }
    const service = new StatsService();
    const files = await service.getMostlyPlayedFiles(
      (interaction as any).user.id
    );
    if (files?.length) {
      await interaction.reply({
        ephemeral: true,
        content: `Your favorite files:`,
        components: changeArrayToRowOfButtons(files as { fileName: string }[]),
      });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `You don't have any file played yet! As soon as you start playing files they will appear here`,
      });
    }
  },
};

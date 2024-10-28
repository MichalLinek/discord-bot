import { SlashCommandBuilder } from "@discordjs/builders";
import { StatsService } from "../../src/utils/stats.service";

export default {
  data: new SlashCommandBuilder()
    .setName("favorites")
    .setDescription("Show most used files"),

  async run(interaction: any) {
    const service = new StatsService();
    const files = await service.getMostlyPlayedFiles(
      (interaction as any).user.id
    );
    if (files?.length) {
      await interaction.reply({
        ephemeral: true,
        content: `Your favorite files:`,
        components: [
          {
            type: 1,
            components: files.map((file) => {
              let fileName = file.fileName?.split("\\").pop();

              fileName = fileName?.substring(0, fileName.length - 4);
              return {
                type: 2,
                label: fileName,
                style: 1,
                custom_id: file.fileName,
              };
            }),
          },
        ],
      });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `You don't have any file played yet! As soon as you start playing files they will appear here`,
      });
    }
  },
};

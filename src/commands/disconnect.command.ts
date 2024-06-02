import { SlashCommandBuilder } from "@discordjs/builders";
import { SoundBotClient } from "src/utils/sound-bot.client";

export default {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnect SoundBot to the Voice Channel"),
  async run(interaction: any) {
    if (process.env.ADMIN_ID === interaction.user.id) {
      const client: SoundBotClient = interaction.client;
      await interaction.reply({ content: "Bye", ephemeral: true });
      client.disconnectFromChannel();
    } else {
      await interaction.reply({
        content: "Only Admin can disconnect me :(",
        ephemeral: true,
      });
    }
  },
};

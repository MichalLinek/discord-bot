import { SlashCommandBuilder } from "@discordjs/builders";
import { SoundBotClient } from "src/utils/sound-bot.client";

export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite SoundBot to the Voice Channel"),

  async run(interaction: any) {
    const client: SoundBotClient = interaction.client;
    if (process.env.ADMIN_ID === interaction.user.id) {
      client.joinChannel(interaction);
      await interaction.reply({ content: "Welcome", ephemeral: true });
    } else {
      await interaction.reply({
        content: "Only Admin can invite me :(",
        ephemeral: true,
      });
    }
  },
};

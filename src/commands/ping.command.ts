import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong."),
  async run(interaction: CommandInteraction) {
    await interaction.reply({ ephemeral: true, content: "Pong" });
  },
};

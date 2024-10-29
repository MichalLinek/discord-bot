import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn how to use DiscordBot to play sounds."),
  async run(interaction: CommandInteraction) {
    await interaction.reply({
      ephemeral: true,
      content: `
# How to use:
There are following commands to use:\n
- \`/list <folder>\` to view the files to play inside the given <folder>
> Example: \`/list folder:Age Of Empires\`\n
- \`/find <query>\` to search files by the given <query> 
> Example: \`/find query:Kim\`\n
`,
    });
  },
};

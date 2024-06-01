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
There are 3 commands to use:\n
- \`/list <folder>\` to view the files to play inside the given <folder>
> Example: \`/list folder:Age Of Empires\`\n
- \`/search <phrase>\` to search files by the given <phrase> 
> Example: \`/search phrase:Kim\`\n
`,
    });
  },
};

import { CommandInteraction } from "discord.js";
import { SoundBotClient } from "./sound-bot.client";
export default async function handleCommand(
  client: SoundBotClient,
  interaction: CommandInteraction
) {
  const { commandName } = interaction;
  const command = client.commands.get(commandName);

  if (!command) {
    console.error(`Command ${commandName} not found.\n`);
    return;
  }
  try {
    await (command as any).run(interaction);
  } catch (error) {
    console.error(`An error occurred in ${commandName}\n`);
  }
}

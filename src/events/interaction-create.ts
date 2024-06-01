import { Interaction } from "discord.js";
import { handleEvent } from "../utils/handle-event";
import { SoundBotClient } from "src/utils/sound-bot.client";
import handleCommand from "../utils/handle-command";

export default {
  name: "interactionCreate",
  execute: (client: SoundBotClient, interaction: any) => {
    // const commandName = interaction.commandName;
    // const commandData = client.commands.get(commandName.toLowerCase());

    // if (!commandData) {
    //   console.log("Missing command '" + commandName + "'.");
    //   return;
    // }

    // try {
    //   console.log(commandData);
    //   //commandData.run(interaction);
    // } catch (error) {
    //   console.error("Error during command execution");
    // }
    // const runCommand = async (...args: any) => {
    //   try {
    //     console.log(interaction);
    //     await interaction.execute();
    //   } catch (error) {
    //     console.error(
    //       `An error occurred in '${interaction.name}' event.\n${error}\n`
    //     );
    //   }
    // };
    if (interaction.isCommand()) {
      handleCommand(client, interaction);
    }
    //client.on(interaction.name, interaction.run);
  },
};

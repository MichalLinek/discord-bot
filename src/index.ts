const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
require("dotenv/config");
const { REST } = require("@discordjs/rest");
import { SoundBotClient } from "./utils/sound-bot.client";

const soundBot = new SoundBotClient();
soundBot.run();

// const commands: any[] = [
//   {
//     name: "help",
//     description: "Learn how to use DiscordBot to play sounds",
//   },
//   {
//     name: "list",
//     description: "Displays available sounds",
//     options: [
//       {
//         name: "folder",
//         description: "Folder containing the files to play",
//         type: 3,
//         required: true,
//         choices: createOptions(fileDatabase),
//       },
//     ],
//   },
//   {
//     name: "search",
//     description: "Search for the sound by phrase",
//     options: [
//       {
//         name: "phrase",
//         description: "Part of the file",
//         required: true,
//         type: ApplicationCommandOptionType.String,
//       },
//     ],
//   },
//   {
//     name: "autocomplete",
//     description: "Look up the sound",
//     options: [
//       {
//         name: "phrase",
//         description: "Fill some text",
//         required: true,
//         autocomplete: true,
//         type: ApplicationCommandOptionType.String,
//       },
//     ],
//   },
//   {
//     name: "invite",
//     description: "Invite SoundBot to the Voice Channel",
//   },
//   {
//     name: "disconnect",
//     description: "Disconnect SoundBot to the Voice Channel",
//   },
// ];

// client.on(Events.InteractionCreate, async (interaction: any) => {
//   if (interaction.isAutocomplete()) {
//     const command = interaction.client.commands.get(interaction.commandName);

//     if (!command) return;
//     try {
//       await command.autocomplete(interaction);
//     } catch (err) {
//       return;
//     }
//   }

// if (interaction.isButton()) {
//   if (!player) joinChannel(interaction);
//   let resource = createAudioResource(interaction.customId);
//   player.play(resource);
//   await interaction.deferUpdate();
//   return;
// }
// if (!interaction.isChatInputCommand()) return;

// const { commandName, options } = interaction;

// if (commandName === "list") {
//   const key = options.data[0]?.value as string;
//   await interaction.reply({
//     ephemeral: true,
//     content: `Sounds from **${key}**:`,
//     components: createButtons(fileDatabase, key),
//   });
// }
// if (commandName === "disconnect") {
//   if (process.env.ADMIN_ID === interaction.user.id) {
//     await interaction.reply({ content: "Bye", ephemeral: true });
//     connection?.disconnect();
//     player = null;
//     connection = null;
//   } else {
//     await interaction.reply({
//       content: "Only Admin can disconnect me :(",
//       ephemeral: true,
//     });
//   }
// }
// if (commandName === "invite") {
//   if (process.env.ADMIN_ID === interaction.user.id) {
//     joinChannel(interaction);
//     await interaction.reply({ content: "Welcome", ephemeral: true });
//   } else {
//     await interaction.reply({
//       content: "Only Admin can invite me :(",
//       ephemeral: true,
//     });
//   }
// }
// if (commandName === "search") {
//   const phrase = options.data[0]?.value as string;

//   const foundItems = searchButtons(fileDatabase, phrase);
//   if (foundItems[0].components?.length === 1) {
//     const file = foundItems[0].components[0]["custom_id"];
//     let resource = createAudioResource(file);
//     const fileName = file.substring(file.lastIndexOf("\\") + 1);

//     player.play(resource);
//     await interaction.reply({
//       content: `Playing ${fileName}`,
//       ephemeral: true,
//     });
//   } else if (foundItems[0].components?.length > 1) {
//     await interaction.reply({
//       ephemeral: true,
//       content: `Search results of phrase **${phrase}**:`,
//       components: foundItems,
//     });
//   } else {
//     await interaction.reply({
//       ephemeral: true,
//       content: `No items found for **${phrase}**, try to use different phrase`,
//     });
//   }
// }
//});

// function joinChannel(interaction: any) {
//   connection = joinVoiceChannel({
//     channelId:
//       interaction.member.voice.channel?.id || process.env.VOICE_CHANNEL_ID,
//     guildId: interaction.member.guild.id,
//     adapterCreator: interaction.guild.voiceAdapterCreator,
//   });
//   player = createAudioPlayer();
//   connection.subscribe(player);
// }

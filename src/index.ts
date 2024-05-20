const {
  Client,
  GatewayIntentBits,
  Routes,
  ApplicationCommandOptionType,
} = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
require("dotenv/config");
const { REST } = require("@discordjs/rest");
import { Interaction } from "discord.js";
import { createButtons } from "./create-buttons";
import { createOptions } from "./create-options";
import { File } from "./interfaces/file.interface";
import { searchButtons } from "./search-buttons";

const fs = require("fs");
const path = require("path");

const cwd = process.cwd();

const getFilesInFolder = (folderPath: string, currFolder: string) => {
  const files = fs.readdirSync(folderPath);
  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesInFolder(filePath, fileName);
    } else {
      const prefixStart = currFolder.indexOf("(");
      const prefixEnd = currFolder.indexOf(")");
      if (!fileDatabase[currFolder]) {
        fileDatabase[currFolder] = {
          name:
            prefixStart > -1
              ? currFolder.substring(0, prefixStart)
              : currFolder,
          description: "Test",
          choices: {},
        };
      }

      let shortcutPrefix = "";
      if (prefixStart > -1 && prefixEnd > -1 && prefixStart < prefixEnd) {
        shortcutPrefix = currFolder.substring(prefixStart + 1, prefixEnd);
      }

      fileDatabase[currFolder].choices[fileName] = {
        path: folderPath + "\\" + fileName,
        name: path.parse(fileName).name,
        shortcut: shortcutPrefix
          ? shortcutPrefix +
            (Object.keys(fileDatabase[currFolder].choices).length + 1)
          : "",
      } as File;
    }
  }
};

const main = () => {
  let currFolder = "/sounds";
  const folderPath = path.join(cwd, "/sounds");
  getFilesInFolder(folderPath, currFolder);
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

let fileDatabase: { [key: string]: any } = {};
let connection: any;
let player: any;
let shortcuts: { [key: string]: any } = {};

main();

const commands = [
  {
    name: "help",
    description: "Learn how to use DiscordBot to play sounds",
  },
  {
    name: "list",
    description: "Displays available sounds",
    options: [
      {
        name: "folder",
        description: "Folder containing the files to play",
        type: 3,
        required: true,
        choices: createOptions(fileDatabase),
      },
    ],
  },
  {
    name: "play",
    description: "Play sound from the File Database",
    options: [
      {
        name: "shortcut",
        description: "Shortcut assigned to a file",
        required: true,
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  {
    name: "search",
    description: "Search for the sound by phrase",
    options: [
      {
        name: "phrase",
        description: "Part of the file",
        required: true,
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  {
    name: "invite",
    description: "Invite SoundBot to the Voice Channel",
  },
  {
    name: "disconnect",
    description: "Disconnect SoundBot to the Voice Channel",
  },
];

client.on("ready", async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );

    Object.keys(fileDatabase)
      .flatMap((x) => Object.values(fileDatabase[x].choices))
      .map((x: any) => {
        shortcuts[x.shortcut] = x.path;
      });
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (interaction.isButton()) {
    if (!player) joinChannel(interaction);
    let resource = createAudioResource(interaction.customId);
    const fileName = interaction.customId.substring(
      interaction.customId.lastIndexOf("\\") + 1
    );

    player.play(resource);
    await interaction.reply({
      content: `Playing ${fileName}`,
      ephemeral: true,
    });
  }
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "list") {
    const key = options.data[0]?.value as string;
    const keyWithoutShortcut =
      key.indexOf("(") > -1 ? key.substring(0, key.indexOf("(")) : key;
    await interaction.reply({
      ephemeral: true,
      content: `Sounds from **${keyWithoutShortcut}**:`,
      components: createButtons(fileDatabase, key),
    });
  }
  if (commandName === "disconnect") {
    if (process.env.ADMIN_ID === interaction.user.id) {
      await interaction.reply({ content: "Bye", ephemeral: true });
      connection?.disconnect();
      player = null;
      connection = null;
    } else {
      await interaction.reply({
        content: "Only Admin can disconnect me :(",
        ephemeral: true,
      });
    }
  }
  if (commandName === "invite") {
    if (process.env.ADMIN_ID === interaction.user.id) {
      joinChannel(interaction);
      await interaction.reply({ content: "Welcome", ephemeral: true });
    } else {
      await interaction.reply({
        content: "Only Admin can invite me :(",
        ephemeral: true,
      });
    }
  }
  if (commandName === "play") {
    if (!player) joinChannel(interaction);
    const option = options.get("shortcut") as any;
    const shortcut = shortcuts[option?.value];

    if (shortcut) {
      const fileName = shortcut.substring(shortcut.lastIndexOf("\\") + 1);
      await interaction.reply({
        content: `Running \`/play ${option?.value}\` -> Playing ${fileName}`,
        ephemeral: true,
      });
      const resource = createAudioResource(shortcut);
      player.play(resource);
    } else {
      await interaction.reply({
        content: `Key Sound \`${option.value}\` not found - use \`/list\` command to view available sound files`,
        ephemeral: true,
      });
    }
  }
  if (commandName === "search") {
    const phrase = options.data[0]?.value as string;

    const foundItems = searchButtons(fileDatabase, phrase);
    if (foundItems[0].components?.length === 1) {
      const file = foundItems[0].components[0]["custom_id"];
      let resource = createAudioResource(file);
      const fileName = file.substring(file.lastIndexOf("\\") + 1);

      player.play(resource);
      await interaction.reply({
        content: `Playing ${fileName}`,
        ephemeral: true,
      });
    } else if (foundItems[0].components?.length > 1) {
      await interaction.reply({
        ephemeral: true,
        content: `Search results of phrase **${phrase}**:`,
        components: foundItems,
      });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `No items found for **${phrase}**, try to use different phrase`,
      });
    }
  }
  if (commandName === "help") {
    await interaction.reply({
      ephemeral: true,
      content: `
# How to use:
There are 3 commands to use:\n
- \`/list <folder>\` to view the files to play inside the given <folder>
> Example: \`/list folder:Age Of Empires\`\n
- \`/search <phrase>\` to search files by the given <phrase> 
> Example: \`/search phrase:Kim\`\n
- \`/play <file shortcut>\` to play the sound by <shortcut> assigned to a file
> Example: \`/play shortcut:o1\`
`,
    });
  }
});

client.login(process.env.TOKEN);

function joinChannel(interaction: any) {
  connection = joinVoiceChannel({
    channelId:
      interaction.member.voice.channel?.id || process.env.VOICE_CHANNEL_ID,
    guildId: interaction.member.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });
  player = createAudioPlayer();
  connection.subscribe(player);
}

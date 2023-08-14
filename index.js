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
const createButtons = require("./create-buttons");
const searchButtons = require("./search-buttons");
const createOptions = require("./create-options");
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();

const getFilesInFolder = (folderPath, currFolder) => {
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
            name: prefixStart > -1 ? currFolder.substring(0, prefixStart) : currFolder,
            description: 'Test',
            choices: {}
          }
        }

        let shortcutPrefix = "";
          if (prefixStart > -1 && prefixEnd > -1 && prefixStart < prefixEnd) {
            shortcutPrefix = currFolder.substring(prefixStart + 1, prefixEnd);
          }

        fileDatabase[currFolder].choices[fileName] = {
          path: folderPath + "\\" + fileName,
          name: path.parse(fileName).name,
          shortcut: shortcutPrefix ?  shortcutPrefix + (Object.keys(fileDatabase[currFolder].choices).length + 1) : ''
        };
    }
  }
};

const main = () => {
  currFolder = '/sounds';
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

let fileDatabase = {};
let connection;
let player;
let shortcuts = {};

main();

const commands = [
  {
    name: "list",
    description: 'Displays available sounds',
    options: [{
      name: 'source',
      description: 'Source of sounds',
      type: 3,
      required: true,
      choices: createOptions(fileDatabase)
    }],
  },
  {
    name: 'play',
    description: "Play sounds from one of the movies/games",
    options: [{
      name: 'shortcut',
      description: 'Name of the file',
      required: true,
      type: ApplicationCommandOptionType.String

    }]
  },
  {
    name: 'search',
    description: "Search for the sound by phrase",
    options: [{
      name: 'phrase',
      description: 'Part of the file',
      required: true,
      type: ApplicationCommandOptionType.String
    }]
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
    
    Object.keys(fileDatabase).flatMap(x => Object.values(fileDatabase[x].choices)).map(x => {
      shortcuts[x.shortcut] = x.path;
    })
      
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (!player) joinChannel(interaction)
    resource =  createAudioResource(interaction.customId);
    const fileName = interaction.customId.substring(interaction.customId.lastIndexOf("\\") + 1);

    player.play(resource);
    await interaction.reply({ content: `Playing ${fileName}`, ephemeral: true });
  }
  if (!interaction.isChatInputCommand()) return;
  
  const { commandName, options } = interaction;

  if (commandName === "list") {
    const key = options.data[0]?.value;
    const keyWithoutShortcut = key.indexOf('(') > -1 ? key.substring(0, key.indexOf('(')) : key;
    await interaction.reply({
      ephemeral: true,
      content: `Sounds from **${keyWithoutShortcut}**:`,
      components: createButtons(fileDatabase, key)
  })
  }
  if (commandName === "disconnect") {
    await interaction.reply({ content: "Bye", ephemeral: true });
    connection?.disconnect();
    player = null;
    connection = null;
  }
  if (commandName === "invite") {
    joinChannel(interaction)
  }
  if (commandName === "play") {
    if (!player) joinChannel(interaction)
    const option = options.get('shortcut');
    const shortcut = shortcuts[option?.value];
    
    if (shortcut) {
      const fileName = shortcut.substring(shortcut.lastIndexOf("\\") + 1);
      await interaction.reply({ content: `Running \`/play ${option?.value}\` -> Playing ${fileName}`, ephemeral: true });
      const resource = createAudioResource(shortcut);
      player.play(resource);
    }
    else {
      await interaction.reply({ content: `Key Sound \`${option.value}\` not found - use \`/list\` command to view available sound files`, ephemeral: true });
    }
  }
  if (commandName === "search") {
    const phrase = options.data[0]?.value;
    

    await interaction.reply({
      ephemeral: true,
      content: `Search results of phrase **${phrase}**:`,
      components: searchButtons(fileDatabase, phrase)
  })
  }
});

///client.on("messageCreate", async (message) => {
  //if (message.content.startsWith("!")) {
    //message.reply('a' + message.member?.voice.channel.members);

    //DISPLAY USER NAME:
    // message.member?.voice.channel.members.forEach((a) => {
    //     message.reply(a.user.username);
    // });
      //if (!player) {
      //  return;
      //}
      // connection = joinVoiceChannel({
      //   channelId: channelId,
      //   guildId: message.guild.id,
      //   adapterCreator: message.guild.voiceAdapterCreator,
      // });
      //const player = createAudioPlayer();
     // connection.subscribe(player);

     // const phrases = message.content.substring(1).split();
     // if (!phrases?.length) return;

     // if (!shortcuts[message]) return;
      //await interaction.reply({ content: "Playing", ephemeral: true });
      //const resource = createAudioResource("./sounds" + shortcuts[message]);
      //layer.play(resource);
    //}
  //}
//);

client.login(process.env.TOKEN);


joinChannel = (interaction) => {
  connection = joinVoiceChannel({
    channelId:
      interaction.member.voice.channel?.id || process.env.VOICE_CHANNEL_ID,
    guildId: interaction.member.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });
  player = createAudioPlayer();
  connection.subscribe(player);
}
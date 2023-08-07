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
const FileNameMap = require("./command-to-file-map");
const createButtons = require("./create-buttons");
const createOptions = require("./create-options");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

let connection;
let player;
let shortcuts = {};

const commands = [
  {
    name: "help",
    description: 'Displays available sounds',
    options: [{
      name: 'source',
      description: 'Source of sounds',
      type: 3,
      required: true,
      choices: createOptions()
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
    
    FileNameMap.flatMap(x => Object.values(x.choices)).map(x => {
      shortcuts[x.shortcut] = x.path;
    })
      
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (!player) joinChannel(interaction)
    resource =  createAudioResource("./sounds" + interaction.customId);
    player.play(resource);
    await interaction.reply({ content: `Playing ${interaction.customId}`, ephemeral: true });
  }
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "help") {
    const sourceId = options.data[0]?.value;
    await interaction.reply({
      ephemeral: true,
      content: `Sounds from **${FileNameMap[+sourceId].name}**:`,
      components: createButtons(sourceId)
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
    if (shortcuts[option?.value]) {
      await interaction.reply({ content: `Running \`/play ${option?.value}\` -> Playing /sounds${shortcuts[option.value]}`, ephemeral: true });
      const resource = createAudioResource("./sounds" + shortcuts[option.value]);
      player.play(resource);
    }
    else {
      await interaction.reply({ content: `Key Sound \`${option.value}\` not found - use \`/help\` command to view available sound files`, ephemeral: true });
    }
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
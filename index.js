const  {Client, GatewayIntentBits, Routes, ApplicationCommandOptionType } = require('discord.js');
const { joinVoiceChannel,
	createAudioPlayer,
	createAudioResource} = require("@discordjs/voice");
require('dotenv/config');
const { REST } = require('@discordjs/rest')
const FileNameMap = require('./command-to-file-map');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
})
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

let connection;
let player;

const commands = [
    {
        name: 'play',
        description: 'Play sounds from one of the movies',
        options: [{
            name: 'pulpfiction',
            description: 'Pulp Fiction',
            type: ApplicationCommandOptionType.String,
            choices: Object.keys(FileNameMap.pulpfiction).map(trackName => ({
                name: trackName,
                value: FileNameMap.pulpfiction[trackName]
            }))
        },
    {
        name: 'age',
            description: 'Age Of Empires 2',
            type: ApplicationCommandOptionType.String,
            choices: Object.keys(FileNameMap.age).map(trackName => ({
                name: trackName,
                value: FileNameMap.age[trackName]
            }))
    },
{
    name: 'chlopaki',
            description: 'Chlopaki nie placza',
            type: ApplicationCommandOptionType.String,
            choices: Object.keys(FileNameMap.chlopaki).map(trackName => ({
                name: trackName,
                value: FileNameMap.chlopaki[trackName]
            }))
},
{
    name: 'warcraft',
            description: 'Warcraft 3',
            type: ApplicationCommandOptionType.String,
            choices: Object.keys(FileNameMap.warcraft).map(trackName => ({
                name: trackName,
                value: FileNameMap.warcraft[trackName]
            }))
},
{
    name: 'holygrail',
            description: 'Monty Python - Holy Grail',
            type: ApplicationCommandOptionType.String,
            choices: Object.keys(FileNameMap.holygrail).map(trackName => ({
                name: trackName,
                value: FileNameMap.holygrail[trackName]
            }))
}]
    },{
        name: 'invite',
        description: 'Invite SoundBot to the Voice Channel'
    },
    {
    name: 'disconnect',
    description: 'Disconnect SoundBot to the Voice Channel'
}]


client.on('ready', async () => {
    try {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
        body: commands
    })
}
catch(err) {
    console.error(err);
}
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction

    console.log(commandName);
    if (commandName === 'play') {
        if (!player) {
            await interaction.reply({ content: 'I can only play in the VoiceChannel', ephemeral: true });
            return;
        }
        const track = interaction.options.data[0]?.value;
        if (track) {
            await interaction.reply({ content: 'Playing', ephemeral: true });
            const resource = createAudioResource('./sounds/' + track);
            player.play(resource);
        }
    }
    if (commandName === 'disconnect') {
        await interaction.reply({ content: 'Bye', ephemeral: true });
        connection.disconnect();
        player = null;
        connection = null;
    }
    if (commandName === 'invite') {
        await interaction.reply({ content: 'No czesc' });
        connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel?.id || process.env.VOICE_CHANNEL_ID,
            guildId: interaction.member.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
          })
          player = createAudioPlayer();
          connection.subscribe(player);

          const resource = createAudioResource('./sounds/chlopaki/no_czesc.wav');
            player.play(resource)
    }
})

client.on('messageCreate', message => {
    if (message.content.startsWith('!')) {
        const channelId = message.member?.voice.channel?.id || process.env.VOICE_CHANNEL_ID;
        //message.reply('a' + message.member?.voice.channel.members);
        
        //DISPLAY USER NAME:
        // message.member?.voice.channel.members.forEach((a) => {
        //     message.reply(a.user.username);
        // });

		if (channelId) {
			connection = joinVoiceChannel({
                channelId: channelId,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
              })
              const player = createAudioPlayer();
              connection.subscribe(player);
              
              const phrases = message.content.substring(1).split();
              if (!phrases?.length) return;
              const soundKey = phrases[0].toLowerCase();

              if (!FileNameMap[soundKey]) return;
              const resource = createAudioResource('./sounds' + FileNameMap[soundKey]);
              player.play(resource)
		} else {
			message.reply('Join a voice channel then try again!');
		}
    }
})

client.login(process.env.TOKEN);
client.on('voiceStateUpdate', (oldState, newState) => {
    
    // if (oldState.channelId === null) {
    //     connection = joinVoiceChannel({
    //         channelId: newState.channelId,
    //         guildId: newState.guild.id,
    //         adapterCreator: newState.guild.voiceAdapterCreator,
    //       })
    //       const player = createAudioPlayer();
    //       connection.subscribe(player)
          
    //       //const resource = createAudioResource('./sounds/others/goodmorn.wav')
    //       //player.play(resource)
          
          
    // } else if (newState.channelId === null) {
    //     console.log("Left")
    // }
});




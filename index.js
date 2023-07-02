const  {Client, GatewayIntentBits, Routes } = require('discord.js');
const { joinVoiceChannel,
	createAudioPlayer,
	createAudioResource} = require("@discordjs/voice");
require('dotenv/config');
const { REST } = require('@discordjs/rest')

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

client.on('ready', async () => {
    try {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
        body: [{
            name: 'play',
            description: 'Plays one of the sound files',  
        },
        {
            name: 'invite',
            description: 'Invite SoundBot to the Voice Channel'
        },
        {
        name: 'disconnect',
        description: 'Disconnect SoundBot to the Voice Channel'
    }]
    })
}
catch(err) {
    console.error(err);
}
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        console.log('interaction!')
        return;
    }

    const { commandName, options } = interaction

    console.log(commandName);
    if (commandName === 'play') {
        await interaction.reply({ content: 'Playing', ephemeral: true });
    }
    if (commandName === 'disconnect') {
        await interaction.reply({ content: 'Bye!' });
        connection.disconnect();
        player = null;
        connection = null;
    }
    if (commandName === 'invite') {
        await interaction.reply({ content: 'No czesc' });
        connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.member.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
          })
          player = createAudioPlayer();
          connection.subscribe(player);

          const resource = createAudioResource('./sounds/chlopaki_nie_placza/no_czesc.wav');
            player.play(resource)
    }
})

client.on('messageCreate', message => {
    if (message.content.startsWith('play')) {
        const channel = message.member?.voice.channel.id;
        //message.reply('a' + message.member?.voice.channel.members);
        
        //DISPLAY USER NAME:
        // message.member?.voice.channel.members.forEach((a) => {
        //     message.reply(a.user.username);
        // });

		if (channel) {
			connection = joinVoiceChannel({
                channelId: message.member.voice.channel,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
              })
              const player = createAudioPlayer();
              connection.subscribe(player);
              
              const resource = createAudioResource('./sounds/age/' + message.content.split(' ')[1] + '.mp3')
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




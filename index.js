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

client.on('ready', async () => {
    try {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
        body: [{
            name: 'test',
            description: 'Replies to pong 142142.',  
        },
    {
        name: 'leave',
        description: 'Bot leaves the voice channel'
    }]
    })
}
catch(err) {
    console.error(err);
}
})


client.on('interactionCreate', async (interaction) => {
    console.log('inter');
    if (!interaction.isChatInputCommand()) {
        console.log('interaction!')
        return;
    }

    const { commandName, options } = interaction

    console.log(commandName);
    if (commandName === 'test') {
        await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
    }

    if (commandName === 'leave') {
        //connection.disconnect();
        //console.log(interaction.member.voice.channel);
    }
})

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        const channel = message.member?.voice.channel.id;
        //message.reply('a' + message.member?.voice.channel.members);
        
        //DISPLAY USER NAME:
        // message.member?.voice.channel.members.forEach((a) => {
        //     message.reply(a.user.username);
        // });

		if (channel) {
			const connection = joinVoiceChannel({
                channelId: message.member.voice.channel,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
              })
              const player = createAudioPlayer();
              connection.subscribe(player);
              
              const resource = createAudioResource('./sounds/age/king.mp3')
              player.play(resource)
		} else {
			message.reply('Join a voice channel then try again!');
		}
    }
})

client.login(process.env.TOKEN);
client.on('voiceStateUpdate', (oldState, newState) => {
    
    if (oldState.channelId === null) {
        connection = joinVoiceChannel({
            channelId: newState.channelId,
            guildId: newState.guild.id,
            adapterCreator: newState.guild.voiceAdapterCreator,
          })
          const player = createAudioPlayer();
          connection.subscribe(player)
          
          const resource = createAudioResource('./sounds/others/goodmorn.wav')
          player.play(resource)
          
          
    } else if (newState.channelId === null) {
        console.log("Left")
    }
});




import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayer,
  VoiceConnection,
} from "@discordjs/voice";
import { CommandInteraction } from "discord.js";

export class SoundPlayer {
  private player?: AudioPlayer;
  private connection?: VoiceConnection;

  constructor() {}

  public joinChannel(interaction: any) {
    this.connection = joinVoiceChannel({
      channelId:
        interaction.member.voice.channel?.id || process.env.VOICE_CHANNEL_ID,
      guildId: interaction.member.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    this.player = createAudioPlayer();
    this.connection.subscribe(this.player);
  }

  public play(soundPath: string) {
    this.player!.play(createAudioResource(soundPath));
  }
}

import {
  AudioPlayer,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { SoundBotClient } from "./sound-bot.client";
import { StatsService } from "./stats.service";

export class SoundPlayer {
  private player?: AudioPlayer | null;
  private connection?: VoiceConnection | null;

  constructor(private botClient: SoundBotClient) {}
  public joinChannel(interaction: any) {
    if (this.player) return;
    this.connection = joinVoiceChannel({
      channelId:
        interaction.member.voice.channel?.id || process.env.VOICE_CHANNEL_ID,
      guildId: interaction.member.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    this.player = createAudioPlayer();
    this.connection.subscribe(this.player);
  }

  public disconnectFromChannel() {
    this.connection?.disconnect();
    this.player = null;
    this.connection = null;
  }

  public play(interaction: any, soundPath: string) {
    if (!this.player) {
      this.joinChannel(interaction);
    }

    this.player!.play(createAudioResource(soundPath));

    if (this.botClient.saveStatistics) {
      const service = new StatsService();
      service.storePlayStatistic(interaction.user.id, interaction.customId);
    }
  }
}

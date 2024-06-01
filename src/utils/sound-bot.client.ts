import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { Command } from "discord.js-commando";

import path from "node:path";
import requireAll from "require-all";
import { handleEvent } from "./handle-event";

export class SoundBotClient extends Client {
  commands: Collection<string, Command> = new Collection();
  rest: REST;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });

    this.rest = new REST().setToken(process.env.TOKEN!);
  }

  async resolveModules() {
    const sharedSettings = {
      recursive: true,
      filter: /\w*.[tj]s/g,
    };

    requireAll({
      ...sharedSettings,
      dirname: path.join(__dirname, "../commands"),
      resolve: (x) => {
        const command = x.default as any;
        console.log(command);
        console.log(`Command '${command.data.name}' registered.`);
        this.commands.set(command.data.name, command);
      },
    });

    requireAll({
      ...sharedSettings,
      dirname: path.join(__dirname, "../events"),
      resolve: async (x) => {
        const event = x.default as any;
        console.log(`Event '${event.name}' registered.`);
        handleEvent(this, event);
      },
    });
  }

  async run() {
    await this.resolveModules();
    await this.login(process.env.TOKEN);
  }

  async deployCommands() {
    try {
      const commandsJSON = [...this.commands.values()].map((x: any) =>
        x.data.toJSON()
      );
      const data = await this.rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID!,
          process.env.GUILD_ID!
        ),
        { body: commandsJSON }
      );

      console.log(
        `Successfully reloaded ${
          (data as any[]).length
        } application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  }
}

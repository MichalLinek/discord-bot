import { SoundBotClient } from "./sound-bot.client";

export function handleEvent(client: SoundBotClient, event: any) {
  const avoidException = async (...args: any) => {
    try {
      await event.execute(client, ...args);
    } catch (error) {
      console.error(`An error occurred in '${event.name}' event.\n${error}\n`);
    }
  };

  client.on(event.name, avoidException);
}

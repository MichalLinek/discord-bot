require("dotenv/config");
import { SoundBotClient } from "./utils/sound-bot.client";

const soundBot = new SoundBotClient();
soundBot.run();

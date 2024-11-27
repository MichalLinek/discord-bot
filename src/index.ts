require("dotenv/config");
import { SoundBotClient } from "./utils/sound-bot.client";
const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

const soundBot = new SoundBotClient();
soundBot.run();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.get("/", (req: any, res: any) => {
  res.send("hello world" + soundBot);
});

app.post("/play", (req: any, res: any) => {
  soundBot.playOnline(req.body.path);
  res.sendStatus(200);
});

app.get("/data", (req: any, res: any) => {
  res.json(soundBot.getFiles());
});

app.listen(5000);

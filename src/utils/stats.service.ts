import * as fs from "fs";
import * as path from "path";
import { File } from "../interfaces/file.interface";
import mongoose, { Schema } from "mongoose";
import { connect } from "http2";

const rootPath = "/sounds";
export class MongoService {
  async getMyPopularFiles() {
    const connection = await mongoose.connect("mongodb://localhost:27017");

    const schema = new Schema({
      name: { type: String },
      userId: { type: String },
      lastTimePlayed: { type: Date, default: Date.now },
      playCount: { type: Number, default: 0 },
    });
    mongoose.model("Files", schema);
    console.log("connected to mongoDB");

    connection.modelNames;
    //if connect collection doesn't exit create on with list of files
    connection.disconnect();
  }

  init() {}
}

// /
// function getFilesInFolder(folderPath: string, currFolder: string) {
//   const files = fs.readdirSync(folderPath);
//   for (const fileName of files) {
//     const filePath = path.join(folderPath, fileName);
//     if (fs.statSync(filePath).isDirectory()) {
//       getFilesInFolder(filePath, fileName);
//     } else {
//       if (!data[currFolder]) {
//         data[currFolder] = {
//           name: currFolder,
//           description: "Test",
//           choices: {},
//         };
//       }

//       data[currFolder].choices[fileName] = {
//         path: folderPath + "\\" + fileName,
//         name: path.parse(fileName).name,
//       } as File;
//     }
//   }
// }

// function dataInitialize() {
//   const cwd = process.cwd();
//   let currFolder = rootPath;
//   const folderPath = path.join(cwd, rootPath);
//   getFilesInFolder(folderPath, currFolder);
// }

// }

import * as fs from "fs";
import * as path from "path";
import { File } from "../interfaces/file.interface";

const rootPath = "/sounds";

let data: { [key: string]: any } = {};

function getFilesInFolder(folderPath: string, currFolder: string) {
  const files = fs.readdirSync(folderPath);
  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesInFolder(filePath, fileName);
    } else {
      if (!data[currFolder]) {
        data[currFolder] = {
          name: currFolder,
          description: "Test",
          choices: {},
        };
      }

      data[currFolder].choices[fileName] = {
        path: folderPath + "\\" + fileName,
        name: path.parse(fileName).name,
      } as File;
    }
  }
}

function dataInitialize() {
  const cwd = process.cwd();
  let currFolder = rootPath;
  const folderPath = path.join(cwd, rootPath);
  getFilesInFolder(folderPath, currFolder);
}

export { data, dataInitialize };

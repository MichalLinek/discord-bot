import * as fs from "fs";
import * as path from "path";
import { File } from "./../interfaces/file.interface";

const rootPath = "/sounds";

export class SoundDB {
  private fileDatabase: { [key: string]: any } = {};

  constructor() {
    this.initialize();
  }

  public getData() {
    return this.fileDatabase;
  }

  private getFilesInFolder = (folderPath: string, currFolder: string) => {
    const files = fs.readdirSync(folderPath);
    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      if (fs.statSync(filePath).isDirectory()) {
        this.getFilesInFolder(filePath, fileName);
      } else {
        if (!this.fileDatabase[currFolder]) {
          this.fileDatabase[currFolder] = {
            name: currFolder,
            description: "Test",
            choices: {},
          };
        }

        this.fileDatabase[currFolder].choices[fileName] = {
          path: folderPath + "\\" + fileName,
          name: path.parse(fileName).name,
        } as File;
      }
    }
  };

  initialize = () => {
    const cwd = process.cwd();
    let currFolder = rootPath;
    const folderPath = path.join(cwd, rootPath);
    this.getFilesInFolder(folderPath, currFolder);
  };
}

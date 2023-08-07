const FileNameMap = require("./command-to-file-map");

createOptions = () => {
  return FileNameMap.map((file, index) => ({
      name: file.name,
      value: `${index}`
    }))
  }

module.exports = createOptions;
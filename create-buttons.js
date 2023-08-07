const FileNameMap = require("./command-to-file-map");
createButtons = (sourceId) => {
  const list = [];
  let currentLine = [];

  const files = FileNameMap[+sourceId];
  Object.keys(files.choices).map((file, index) => {
    if (index > 0 && index % 5 === 0) {
      list.push(currentLine);
      currentLine = [];
    } 

    currentLine.push({
      type: 2,
      label: `${file} (${files.choices[file].shortcut})`,
      style: 1,
      custom_id: files.choices[file].path
    })
  });

  list.push(currentLine);
  const output = list.map(x => ({
    type: 1,
    components: x
  }));
  return output
}


module.exports = createButtons;
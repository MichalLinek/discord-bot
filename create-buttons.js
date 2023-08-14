createButtons = (fileNameMap, key) => {
  const list = [];
  let currentLine = [];

  const files = fileNameMap[key];
  const length = Object.keys(files.choices).length;
  for (let i = 0; i < length; i ++ ) {
    const fileKey = Object.keys(files.choices)[i];
    const file = files.choices[fileKey];
    if (i === 25) {
      console.error('Too many files in one folder - Discord restriction up to 25 items per interaction');
      break;
    };
    if (i > 0 && i % 5 === 0) {
      list.push(currentLine);
      currentLine = [];
    } 

    currentLine.push({
      type: 2,
      label: file.shortcut ?  `${file.name} (${file.shortcut})`: file.name,
      style: 1,
      custom_id: file.path,
    })
  }
  list.push(currentLine);
 
  const output = list.map(x => ({
    type: 1,
    components: x
  }));
  
return output;
}

module.exports = createButtons;
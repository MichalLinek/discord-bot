export function searchButtons(fileDatabase: any, phrase: string) {
  const list = [];
  let currentLine = [];
  let numberOfOutputs = 0;
  phrase = phrase.toLowerCase();

  const length = Object.keys(fileDatabase).length;
  for (let i = 0; i < length; i++) {
    const folder = Object.keys(fileDatabase)[i];
    let files = fileDatabase[folder].choices;
    let fileLength = Object.keys(files).length;

    for (let j = 0; j < fileLength; j++) {
      let file = files[Object.keys(files)[j]];

      if (file.name.toLowerCase().includes(phrase)) {
        if (numberOfOutputs === 25) {
          console.error(
            "Too many files found - Discord restriction up to 25 items per interaction"
          );
          break;
        }
        if (numberOfOutputs > 0 && numberOfOutputs % 5 === 0) {
          list.push(currentLine);
          currentLine = [];
        }

        currentLine.push({
          type: 2,
          label: file.name,
          style: 1,
          custom_id: file.path,
        });

        numberOfOutputs += 1;
      }
    }
  }
  list.push(currentLine);

  const output = list.map((x) => ({
    type: 1,
    components: x,
  }));

  return output;
}

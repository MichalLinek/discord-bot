export function autocompleteOptions(fileDatabase: any, phrase: string) {
  let output = [];
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
          break;
        }

        output.push({
          name: file.name,
          value: file.path,
        });

        numberOfOutputs += 1;
      }
    }
  }
  return output;
}

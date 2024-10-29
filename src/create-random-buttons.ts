export function createRandomButtons(fileNameMap: any) {
  const randomPool: any[] = [];

  for (const key in fileNameMap) {
    const files = fileNameMap[key];
    const length = Object.keys(files.choices).length;
    for (let i = 0; i < length; i++) {
      const fileKey = Object.keys(files.choices)[i];
      const file = files.choices[fileKey];
      randomPool.push(file);
    }
  }

  const shuffled = randomPool.sort(() => 0.5 - Math.random());
  let selected = shuffled.slice(0, 25);

  let output = [];
  for (let i = 0; i < 5; i++) {
    const fileList = selected.slice(5 * i, 5 * i + 5);

    if (!fileList?.length) break;

    output.push({
      type: 1,
      components: fileList.map((file) => ({
        type: 2,
        label: file.name,
        style: 1,
        custom_id: file.path,
      })),
    });
  }

  return output;
}

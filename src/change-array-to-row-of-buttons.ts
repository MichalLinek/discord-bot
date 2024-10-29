import { getFileName } from "./get-file-name";

export function changeArrayToRowOfButtons(fileArray: { fileName: string }[]) {
  let output = [];
  for (let i = 0; i < 5; i++) {
    const fileList = fileArray.slice(5 * i, 5 * i + 5);

    if (!fileList?.length) break;

    output.push({
      type: 1,
      components: fileList.map((file) => ({
        type: 2,
        label: getFileName(file.fileName),
        style: 1,
        custom_id: file.fileName,
      })),
    });
  }

  return output;
}

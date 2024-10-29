export function getFileName(filePath: string) {
  let fileName = filePath?.split("\\").pop();
  fileName = fileName?.substring(0, fileName.length - 4);
  return fileName;
}

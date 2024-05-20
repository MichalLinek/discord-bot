export function createOptions(fileDatabase: any) {
  return Object.keys(fileDatabase).map(file => ({
      name: fileDatabase[file].name,
      value: file
    }))
  }
createOptions = (fileDatabase) => {
  
  return Object.keys(fileDatabase).map(file => ({
      name: fileDatabase[file].name,
      value: file
    }))
  }

module.exports = createOptions;
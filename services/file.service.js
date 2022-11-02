const fs = require("fs");
const path = require("path");
const csv = require("./csv.service");

module.exports = {
  createCSVFile: (input) => {
    console.log("input", input);
    const filePath = path.resolve(__dirname, "../uploads");

    const fileName = filePath + "/" + input.currentTestId + "_results.csv";
    let csvContent = csv.createCSV(input.resultsArray);

    fs.writeFile(fileName, csvContent, "utf8", (err) => {
      // throws an error, you could also catch it here
      if (err) {
        return console.log(err);
      }
      // success case, the file was saved
      console.log("file created!");
    });
  },
};

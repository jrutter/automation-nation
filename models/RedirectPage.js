const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RedirectPage = new Schema({
  testId: Number,
  name: String,
  brand: String,
  responseCode: String,
  stepName: String,
  step: String,
  screenshot: String,
  startUrl: String,
  endUrl: String,
  browser: String,
  testDate: String,
  folder: String,
});

module.exports = mongoose.model("RedirectPage", RedirectPage);

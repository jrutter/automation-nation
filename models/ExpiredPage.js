const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expiredPage = new Schema({
  testId: Number,
  name: String,
  brand: String,
  responseCode: String,
  stepName: String,
  step: String,
  campaign: String,
  startDate: String,
  endDate: String,
  orders: String,
  screenshot: String,
  startUrl: String,
  endUrl: String,
  browser: String,
  testDate: String,
});

module.exports = mongoose.model("ExpiredPage", expiredPage);

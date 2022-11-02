const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activePages = new Schema({
  testId: Number,
  name: String,
  brand: String,
  responseCode: String,
  campaign: String,
  startDate: String,
  endDate: String,
  apiDate: String,
  orders: String,
  screenshot: String,
  startUrl: String,
  endUrl: String,
  browser: String,
  testDate: String,
  emailAddress: String,
  lpItemCode: String,
  lpPrice: String,
  lpShipping: String,
  confOrderId: String,
  confItemCode: String,
  confPrice: String,
  confShipping: String,
});

module.exports = mongoose.model("ActivePages", activePages);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Result = new Schema({
  testId: Number,
  name: String,
  brand: String,
  responseCode: String,
  startDate: String,
  endDate: String,
  stepName: String,
  step: String,
  itemCode1: String,
  itemCode2: String,
  itemCode3: String,
  itemName1: String,
  itemName2: String,
  itemName3: String,
  salePrice1: String,
  salePrice2: String,
  salePrice3: String,
  numBottles1: String,
  numBottles2: String,
  numBottles3: String,
  salesActivity: String,
  campaign: String,
  campaginDescription: String,
  orders: String,
  screenshot: String,
  startUrl: String,
  endUrl: String,
  browser: String,
  testDate: String,
});

module.exports = mongoose.model("Result", Result);

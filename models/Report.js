const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  type: String,
  numTests: String,
  activePages: String,
  expiredPages: String,
  failedPages: String,
  requestedBy: String,
});

module.exports = mongoose.model("Report", reportSchema);

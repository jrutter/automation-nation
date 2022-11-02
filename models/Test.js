const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TestSchema = new Schema({
  testId: Number,
  name: String,
  type: String,
  dateTriggered: Date,
  dateCompleted: Date,
  numTests: String,
  environment: String,
  activePages: String,
  activePagesReport: String,
  expiredPages: String,
  expiredPagesReport: String,
  failedPages: String,
  failedPagesReport: String,
  redirectPages: String,
  validatePages: String,
  requestedBy: String,
  comments: String,
  testStatus: String,
});
TestSchema.plugin(AutoIncrement, { inc_field: "testId" });
module.exports = mongoose.model("Test", TestSchema);

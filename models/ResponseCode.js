const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ResponseCodeSchema = new Schema({
  responseCode: Number,
  salesActivity: String,
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
  },
  orders: String,
  name: String,
  type: String,
  dateAdded: Date,
  numTests: String,
  activePages: String,
  activePagesReport: String,
  expiredPages: String,
  expiredPagesReport: String,
  failedPages: String,
  failedPagesReport: String,
  redirectPages: String,
  validatePages: String,
  requestedBy: String,
});

//TestSchema.plugin(AutoIncrement, { inc_field: "testId" });
module.exports = mongoose.model("ResponseCode", ResponseCodeSchema);

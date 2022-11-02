const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CampaignSchema = new Schema({
  campaignID: Number,
  campaignActivity: String,
  campaign: String,
  name: String,
  type: String,
  responseCodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResponseCode",
    },
  ],
  dateAdded: Date,
  numResponseCodes: Number,
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
module.exports = mongoose.model("Campaign", CampaignSchema);

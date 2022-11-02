const CampaignModel = require("../models/Campaign");
const path = require("path");
const { base64encode, base64decode } = require("nodejs-base64");
const CSVToJSON = require("csvtojson");
const parseData = require("../services/filter.service");

let CampaignController = {
  parseCampaignUpload: async (req, res) => {
    const csvFile = req.file.path;
    const filePath = path.resolve(__dirname, "../data", "upload_test_data");
    let testSuite = req.body.testSuite;
    let testEnv = "production";
    let numOrders = 0;
    await CSVToJSON()
      .fromFile(csvFile)
      .then((campaigns) => {
        // console.log({ campaigns });
        let campaignList = parseData.getCampaigns(campaigns);
        res.json(campaignList);
        //console.log({ campaignArray });
      });
  },
  find: async (req, res) => {
    let found = await CampaignModel.find({ name: req.params.username });
    res.json(found);
  },
  getAllCampaigns: async (req, res) => {
    let foundUser = await CampaignModel.find().exec(function (err, result) {
      //console.log("reports", result);
    });
    //console.log({ foundUser });
    //res.json(foundUser);
  },
};

module.exports = CampaignController;

const express = require("express");
const fs = require("fs");
const path = require("path");

// for csv to json and filtering
const CSVToJSON = require("csvtojson");
const converter = require("json-2-csv");

// Import Base65 encoder/decoder
const { base64encode, base64decode } = require("nodejs-base64");

// Mongoose Schema
const e = require("express");

exports.parseEmail = function (req, res) {
  // Grab incoming details from request for the attachment
  // https://postmarkapp.com/developer

  //Check if email from archwaypi - so hackers don't run a gazillion tests
  const fromEmail = req.body.From;
  var emailCheck = fromEmail.includes("archwaypi.com");

  if (emailCheck !== false) {
    console.log("reg", req.body);

    if (req.body.Attachments && req.body.Attachments > 0) {
      const fileName = req.body.Attachments[0].Name;
      const filePath = path.resolve(
        __dirname,
        "../data",
        req.body.Attachments[0].Name
      );

      var campaignFile = emailAttachments.filter(function (attachment) {
        return (attachment.Name = "WP060_Active_Campaigns.csv");
      });

      var giTestData = emailAttachments.filter(function (attachment) {
        return (attachment.Name = "GI_test_data.csv");
      });

      let testObject = {
        emailAttachments: req.body.Attachments,
        campaignFileContent: campaignFile[0].Content,
        csvContent: base64decode(campaignFileContent),
        testType: req.body.Subject,
      };
    }

    res.status(200).end(); // Responding is important
    return true;
  } else {
    // Send a status
    res.status(200).end(); // Responding is important
  }
};

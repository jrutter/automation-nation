const express = require("express");
const fs = require("fs");
const path = require("path");
const CSVToJSON = require("csvtojson");
const converter = require("json-2-csv");
const Validator = require("jsonschema").Validator;
const GhostInspector = require("ghost-inspector")(
  "34705897a4502d29e6fdc085ac6fe7a1517eaf61"
);

// Services
const Test = require("../models/Test");
const notify = require("../services/notify.service");
const parseData = require("../services/filter.service");
const createInput = require("../services/input.service");
const csv = require("../services/csv.service");

// Import Base65 encoder/decoder
const { base64encode, base64decode } = require("nodejs-base64");

exports.parseUpload = function (req, res) {
  // console.log("req", req.file);
  const csvFile = req.file.path;
  const filePath = path.resolve(__dirname, "../data", "upload_test_data");
  let testSuite = req.body.testSuite;
  //let testEnv = req.body.testEnvironment;
  let testEnv = "production";
  //let numOrders = req.body.numOrders;
  let numOrders = 0;

  var campaignSchema = {
    type: "array",
    properties: {
      DWUS_BrandId: { type: "string" },
      website: { type: "string" },
      CampaignId: { type: "string" },
      CampaignName: { type: "string" },
      CampaignDate: { type: "string" },
      CampaignEndDate: { type: "string" },
    },
  };

  let currentTestId;

  try {
    CSVToJSON()
      .fromFile(csvFile)
      .then((campaigns) => {
        //const v = new Validator();
        //v.addSchema(campaignSchema, "/CampaignSchema");
        //console.log(v.validate(campaigns, campaignSchema));

        let testId,
          testHash,
          campaignArray = [];
        res.render("upload.ejs");

        // CART Tests
        if (testSuite === "cart") {
          campaignArray = createInput.createLandingPageFile(
            campaigns,
            testSuite,
            testEnv,
            numOrders
          );
          testId = "6046957b81917f79b87e8665";
        }
        // LP Tests
        else if (testSuite === "lpTest") {
          campaignArray = createInput.createLandingPageOrderFile(
            campaigns,
            testSuite,
            testEnv,
            numOrders
          );
          testId = "619bdb2d2ee7e9fa161a63d4";
        }
        // LP Order Tests
        else if (testSuite === "order") {
          campaignArray = createInput.createLandingPageOrderFile(
            campaigns,
            testSuite,
            testEnv,
            numOrders
          );
          testId = "60b79b264cc5651043488744";
        }
        // Redirect Tests
        else if (testSuite === "redirects") {
          campaignArray = createInput.createRedirectTestFile(
            campaigns,
            testSuite,
            testEnv,
            numOrders
          );
          testId = "60416bb4251eef5ede5c7c2d";
        }
        // Validate Tests
        else if (testSuite === "validate") {
          campaignArray = createInput.createLandingPageFile(
            campaigns,
            testSuite,
            testEnv,
            numOrders
          );
          testId = "605cf102bfd1192cd184c0a3";
        }
        let fileDataLength = campaignArray.length;

        // Convert back to CSV to get ready for Ghost Inspector
        let csvOutput = csv.createCSV(campaignArray);

        // Base64 encode so that can go via email
        let axCSV = base64encode(csvOutput);

        notify.sendEmail({
          emailTeam: "notification",
          emailType: "testKickOff",
          testType: testSuite,
          fileLength: fileDataLength,
          attachmentContent: axCSV,
          attachmentName: "validate_test_data.csv",
        });

        const newTestTrigger = new Test({
          type: testSuite,
          environment: testEnv,
          numTests: fileDataLength,
          requestedBy: req.oidc.user.name,
          dateTriggered: new Date(),
        });
        newTestTrigger.save(function (error, document) {
          if (error) console.error(error);
          currentTestId = document.testId;
          testHash = document._id;
        });

        fs.writeFile(filePath, csvOutput, "utf8", (err) => {
          // throws an error, you could also catch it here
          if (err) {
            notify.sendEmail({
              emailTeam: "error",
              emailType: "applicationError",
            });
            return console.log(err);
          }
          // success case, the file was saved
          console.log("file created!");

          // Ghost inpsector needs an actual file, it dont like no strings
          const options = {
            dataFile: filePath,
          };

          // Exexcute the test suite
          // TODO - Move away from hard-coding a test name, maybe pass in via email in future
          // bd38792468f2474ab1271e722181b33f@inbound.postmarkapp.com <bd38792468f2474ab1271e722181b33f@inbound.postmarkapp.com>

          let resultsArray;
          let failedPages;

          GhostInspector.executeTest(
            testId,
            options,
            function (err, results, passing) {
              if (err) {
                notify.sendEmail({
                  emailTeam: "error",
                  emailType: "applicationError",
                });
                return console.error(err);
              } else {
                if (testSuite === "cart") {
                  resultsArray = parseData.getTestResults(
                    results,
                    currentTestId,
                    testHash
                  );
                  parseData.getActivePages(results, currentTestId, testHash);
                  parseData.getExpiredPages(results, currentTestId, testHash);
                  parseData.getFailedPages(results, currentTestId, testHash);
                  failedPages = resultsArray.length;
                } else if (testSuite === "order") {
                  resultsArray = parseData.getTestResults(
                    results,
                    currentTestId,
                    testHash
                  );
                  parseData.getActivePages(results, currentTestId, testHash);
                  parseData.getExpiredPages(results, currentTestId, testHash);
                  parseData.getFailedPages(results, currentTestId, testHash);
                  failedPages = resultsArray.length;
                } else if (testSuite === "lpTest") {
                  resultsArray = parseData.getTestResults(
                    results,
                    currentTestId,
                    testHash
                  );
                  parseData.getActivePages(results, currentTestId, testHash);
                  parseData.getExpiredPages(results, currentTestId, testHash);
                  parseData.getFailedPages(results, currentTestId, testHash);
                  failedPages = resultsArray.length;
                } else if (testSuite === "redirects") {
                  parseData.getRedirectsResults(
                    results,
                    currentTestId,
                    testHash
                  );
                  failedPages = resultsArray.length;
                } else if (testSuite === "validate") {
                  resultsArray = parseData.checkValidateTest(
                    results,
                    currentTestId,
                    testHash
                  );
                  parseData.getActivePages(results, currentTestId, testHash);
                  parseData.getExpiredPages(results, currentTestId, testHash);
                  parseData.getFailedPages(results, currentTestId, testHash);
                }

                console.log("results", resultsArray);

                let resultsLength = resultsArray.length;
                if (resultsLength > 0) {
                  // Test Results - Pass / Fails
                  let giOutput = csv.createCSV(resultsArray);
                  // Base64 encode so that can go via email
                  let giCSV = base64encode(giOutput);
                  // notify.sendEmail({
                  //   emailTeam: "notification",
                  //   emailType: "failedResults",
                  //   fileLength: resultsLength,
                  //   attachmentContent: giCSV,
                  //   attachmentName: "test_results_all.csv",
                  // });
                } else {
                  notify.sendEmail({
                    emailTeam: "notification",
                    emailType: "passedResults",
                  });
                }

                console.log("Results Email sent");
              }
            }
          );
        });
      });
  } catch (error) {
    console.error(error);
  }
};

exports.uploadCampaigns = function (req, res) {
  // console.log("req", req.file);
  const csvFile = req.file.path;
  const filePath = path.resolve(__dirname, "../data", "campaign_test_data");

  // var campaignSchema = {
  //   type: "array",
  //   properties: {
  //     DWUS_BrandId: { type: "string" },
  //     website: { type: "string" },
  //     CampaignId: { type: "string" },
  //     CampaignName: { type: "string" },
  //     CampaignDate: { type: "string" },
  //     CampaignEndDate: { type: "string" },
  //   },
  // };

  //let currentTestId;

  try {
    CSVToJSON()
      .fromFile(csvFile)
      .then((campaigns) => {
        //const v = new Validator();
        //v.addSchema(campaignSchema, "/CampaignSchema");

        console.log("c", campaigns);

        parseData.getCampaigns(campaigns);

        // str.substring(0, 4);

        let campaignArray = [];
        res.render("upload.ejs");

        let fileDataLength = campaignArray.length;

        // Convert back to CSV to get ready for Ghost Inspector
        //let csvOutput = csv.createCSV(campaignArray);

        // Base64 encode so that can go via email
        //let axCSV = base64encode(csvOutput);

        // const newTestTrigger = new Test({
        //   type: testSuite,
        //   environment: testEnv,
        //   numTests: fileDataLength,
        //   requestedBy: req.oidc.user.name,
        //   dateTriggered: new Date(),
        // });
        // newTestTrigger.save(function (error, document) {
        //   if (error) console.error(error);
        //   currentTestId = document.testId;
        //   testHash = document._id;
        // });

        // fs.writeFile(filePath, csvOutput, "utf8", (err) => {
        //   // throws an error, you could also catch it here
        //   if (err) {
        //     // notify.sendEmail({
        //     //   emailTeam: "error",
        //     //   emailType: "applicationError",
        //     // });
        //     return console.log(err);
        //   }
        //   // success case, the file was saved
        //   console.log("file created!");

        //   // Ghost inpsector needs an actual file, it dont like no strings
        //   const options = {
        //     dataFile: filePath,
        //   };

        //   let resultsArray;
        //   let failedPages;
        // });
      });
  } catch (error) {
    console.error(error);
  }
};

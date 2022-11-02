const _ = require("lodash");
const notify = require("./notify.service");
const { base64encode, base64decode } = require("nodejs-base64");
const fs = require("fs");
const path = require("path");

const ActivePage = require("../models/ActivePage");
const ExpiredPage = require("../models/ExpiredPage");
const Test = require("../models/Test");
const Result = require("../models/Result");
const CampaignModel = require("../models/Campaign");

const csv = require("./csv.service");
const fileService = require("./file.service");
const test = require("./test.service");

module.exports = {
  getTestResults: (results, currentTestId, testHash) => {
    let resultsArray = [];

    // For failed results, create an array of results
    // Pull out the expired pages, only show broken pages and step where it broke
    _.forEach(results, function (value) {
      var str = value.endUrl;
      var expired = str.includes("ExpiryPage");
      let steps = value.steps;
      let failedStep = steps.filter(function (step) {
        return step.passing === false;
      });

      let stepName, stepNotes;
      if (failedStep === undefined || failedStep.length == 0) {
        // array empty or does not exist
        stepName = "";
        stepNotes = "";
      } else {
        stepName = failedStep[0].error;
        stepNotes = failedStep[0].notes;
      }

      let screenshotUrl;
      if (value.screenshot != null) {
        screenshotUrl = value.screenshot.original.defaultUrl;
      } else {
        screenshotUrl = null;
      }
      console.log("screenshotUrl", screenshotUrl);

      // Filter out expired pages
      resultsArray.push({
        brand: value.variables.brand,
        responseCode: value.variables.responseCode,
        expired: expired,
        stepName: stepName,
        step: stepNotes,
        campaign: value.variables.campaign,
        orders: value.variables.orders,
        startDate: value.variables.startDate,
        endDate: value.variables.endDate,
        screenshot: screenshotUrl,
        startUrl: value.startUrl,
        endUrl: value.endUrl,
        browser: value.browser,
        testDate: value.dateExecutionFinished,
      });
    });

    console.log("getTestResults", resultsArray);

    let inputObject = {
      resultsArray,
      currentTestId,
    };
    fileService.createCSVFile(inputObject);

    Test.findByIdAndUpdate(
      testHash,
      {
        redirectPages: "n/a",
        dateCompleted: new Date(),
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("completed : ", docs);
        }
      }
    );

    return resultsArray;
  },
  getFailedPages: (results, currentTestId, testHash) => {
    let resultsArray = [];

    const failedResults = _.filter(results, function (o) {
      return o.passing === false;
    });

    // For failed results, create an array of results
    // Pull out the expired pages, only show broken pages and step where it broke
    _.forEach(failedResults, function (value) {
      var str = value.endUrl;
      var expired = str.includes("ExpiryPage");

      let steps = value.steps;
      let failedStep = steps.filter(function (step) {
        return step.passing === false;
      });

      let responseCode = value.variables.responseCode;
      let campaign = responseCode.substring(0, 4);

      let screenshotUrl;
      if (value.screenshot != null) {
        screenshotUrl = value.screenshot.original.defaultUrl;
      } else {
        screenshotUrl = null;
      }
      console.log("screenshotUrl", screenshotUrl);

      // Filter out expired pages
      if (!expired) {
        resultsArray.push({
          brand: value.variables.brand,
          responseCode: value.variables.responseCode,
          stepName: failedStep[0].notes,
          step: failedStep[0].error,
          campaign: campaign,
          campaginDescription: value.variables.campaign,
          orders: value.variables.orders,
          screenshot: screenshotUrl,
          startUrl: value.startUrl,
          endUrl: value.endUrl,
          browser: value.browser,
          startDate: value.variables.startDate,
          endDate: value.variables.endDate,
          testDate: value.dateExecutionFinished,
        });

        let newResult = new Result({
          testId: currentTestId,
          brand: value.variables.brand,
          responseCode: value.variables.responseCode,
          stepName: failedStep[0].notes,
          step: failedStep[0].error,
          campaign: campaign,
          campaginDescription: value.variables.campaign,
          orders: value.variables.orders,
          startDate: value.variables.startDate,
          endDate: value.variables.endDate,
          screenshot: screenshotUrl,
          startUrl: value.startUrl,
          endUrl: value.endUrl,
          browser: value.browser,
          testDate: value.dateExecutionFinished,
        });
        newResult.save(function (error, document) {
          if (error) console.error(error);
          console.log("doc", document);
        });
      }
    });
    let failedPages = resultsArray.length;
    console.log("failed", failedPages);
    Test.findByIdAndUpdate(
      testHash,
      {
        failedPages: failedPages,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
          test.completeTest(currentTestId);
        }
      }
    );
    return resultsArray;
  },
  checkValidateTest: (results, currentTestId, testHash) => {
    let resultsArray = [];

    const failedResults = _.filter(results, function (o) {
      return o.passing === false;
    });

    console.log("failedResults", failedResults);

    // For failed results, create an array of results
    _.forEach(results, function (value) {
      var str = value.endUrl;
      var expired = str.includes("ExpiryPage");

      let steps = value.steps;
      let failedStep = steps.filter(function (step) {
        return step.passing === false;
      });

      let responseCode = value.variables.responseCode;
      let campaign = responseCode.substring(0, 4);

      let stepName, stepNotes;
      if (failedStep === undefined || failedStep.length == 0) {
        // array empty or does not exist
        stepName = "";
        stepNotes = "";
      } else {
        stepName = failedStep[0].error;
        stepNotes = failedStep[0].notes;
      }

      let screenshotUrl;
      if (value.screenshot != null) {
        screenshotUrl = value.screenshot.original.defaultUrl;
      } else {
        screenshotUrl = null;
      }
      console.log("screenshotUrl", screenshotUrl);

      // Filter out expired pages
      resultsArray.push({
        brand: value.variables.brand,
        responseCode: value.variables.responseCode,
        expired: expired,
        stepName: stepName,
        step: stepNotes,
        campaign: campaign,
        campaginDescription: value.variables.campaign,
        orders: value.variables.orders,
        screenshot: screenshotUrl,
        startUrl: value.startUrl,
        endUrl: value.endUrl,
        browser: value.browser,
        startDate: value.variables.startDate,
        endDate: value.variables.endDate,
        testDate: value.dateExecutionFinished,
        itemCode1: value.variables.itemCode1,
        itemName1: value.variables.itemName1,
        salePrice1: value.variables.salePrice1,
        numBottles1: value.variables.numBottles1,
        itemName2: value.variables.itemName2,
        itemCode2: value.variables.itemCode2,
        salePrice2: value.variables.salePrice2,
        numBottles2: value.variables.numBottles2,
        itemCode3: value.variables.itemCode3,
        itemName3: value.variables.itemName3,
        salePrice3: value.variables.salePrice3,
        numBottles3: value.variables.numBottles3,
        salesActivity: value.variables.salesActivity,
      });

      let newResult = new Result({
        testId: currentTestId,
        brand: value.variables.brand,
        responseCode: value.variables.responseCode,
        itemCode1: value.variables.itemCode1,
        itemName1: value.variables.itemName1,
        salePrice1: value.variables.salePrice1,
        numBottles1: value.variables.numBottles1,
        itemName2: value.variables.itemName2,
        itemCode2: value.variables.itemCode2,
        salePrice2: value.variables.salePrice2,
        numBottles2: value.variables.numBottles2,
        itemCode3: value.variables.itemCode3,
        itemName3: value.variables.itemName3,
        salePrice3: value.variables.salePrice3,
        numBottles3: value.variables.numBottles3,
        salesActivity: value.variables.salesActivity,
        stepName: stepName,
        step: stepNotes,
        campaign: campaign,
        campaginDescription: value.variables.campaign,
        orders: value.variables.orders,
        screenshot: screenshotUrl,
        startUrl: value.startUrl,
        endUrl: value.endUrl,
        startDate: value.variables.startDate,
        endDate: value.variables.endDate,
        browser: value.browser,
        testDate: value.dateExecutionFinished,
      });
      newResult.save(function (error, document) {
        if (error) console.error(error);
        console.log("doc", document);
      });
    });

    let failedPages = failedResults.length;
    Test.findByIdAndUpdate(
      testHash,
      {
        failedPages: failedPages,
        dateCompleted: new Date(),
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
        }
      }
    );
    let inputObject = {
      resultsArray,
      currentTestId,
    };
    fileService.createCSVFile(inputObject);
    return resultsArray;
  },
  getExpiredPages: (results, currentTestId, testHash) => {
    let expiredArray = [];
    const failedResults = _.filter(results, function (o) {
      return o.passing === false;
    });

    console.log("failedResults", failedResults);

    _.forEach(failedResults, function (value) {
      var str = value.endUrl;
      var expired = str.includes("ExpiryPage");

      let steps = value.steps;
      let failedStep = steps.filter(function (step) {
        return step.passing === false;
      });

      let responseCode = value.variables.responseCode;
      let campaign = responseCode.substring(0, 4);

      let screenshotUrl;
      if (value.screenshot != null) {
        screenshotUrl = value.screenshot.original.defaultUrl;
      } else {
        screenshotUrl = null;
      }
      console.log("screenshotUrl", screenshotUrl);

      // Filter out expired pages
      if (expired) {
        expiredArray.push({
          brand: value.variables.brand,
          responseCode: value.variables.responseCode,
          stepName: failedStep[0].notes,
          step: failedStep[0].error,
          campaign: campaign,
          campaginDescription: value.variables.campaign,
          orders: value.variables.orders,
          screenshot: screenshotUrl,
          startUrl: value.startUrl,
          endUrl: value.endUrl,
          startDate: value.variables.startDate,
          endDate: value.variables.endDate,
          browser: value.browser,
          testDate: value.dateExecutionFinished,
        });

        let newExpiredPage = new ExpiredPage({
          testId: currentTestId,
          brand: value.variables.brand,
          responseCode: value.variables.responseCode,
          stepName: failedStep[0].notes,
          step: failedStep[0].error,
          campaign: campaign,
          campaginDescription: value.variables.campaign,
          orders: value.variables.orders,
          screenshot: screenshotUrl,
          startUrl: value.startUrl,
          endUrl: value.endUrl,
          startDate: value.variables.startDate,
          endDate: value.variables.endDate,
          browser: value.browser,
          testDate: value.dateExecutionFinished,
        });
        newExpiredPage.save(function (error, document) {
          if (error) console.error(error);
          console.log("doc", document);
        });
      }
    });

    let expiredLength = expiredArray.length;
    if (expiredLength > 0) {
      // Expired Pages
      let giOutput = csv.createCSV(expiredArray);

      // Base64 encode so that can go via email
      let giPageCSV = base64encode(giOutput);

      // Send the active pages
      notify.sendEmail({
        emailTeam: "expiredPagesTeam",
        emailType: "expiredPages",
        fileLength: expiredLength,
        attachmentContent: giPageCSV,
        attachmentName: "expired_pages_all.csv",
      });

      console.log("expiredPages Email sent");
    }

    Test.findByIdAndUpdate(
      testHash,
      { expiredPages: expiredLength },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
        }
      }
    );
  },
  getActivePages: (results, currentTestId, testHash) => {
    let activePagesArray = [];

    const passingResults = _.filter(results, function (o) {
      return o.passing === true;
    });

    // Add a date to use in API endpoint
    let d = new Date();
    let formattedDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    // Passing Results Loop
    _.forEach(passingResults, function (value) {
      let responseCode = value.variables.responseCode;
      let campaign = responseCode.substring(0, 4);

      let screenshotUrl;
      if (value.screenshot != null) {
        screenshotUrl = value.screenshot.original.defaultUrl;
      } else {
        screenshotUrl = null;
      }
      activePagesArray.push({
        brand: value.variables.brand,
        responseCode: value.variables.responseCode,
        startUrl: value.startUrl,
        endUrl: value.endUrl,
        campaign: campaign,
        campaginDescription: value.variables.campaign,
        startDate: value.variables.startDate,
        endDate: value.variables.endDate,
        orders: value.variables.orders,
        screenshot: screenshotUrl,
        emailAddress: value.variables.emailUser,
        apiDate: formattedDate,
      });

      let newActivePage = new ActivePage({
        testId: currentTestId,
        brand: value.variables.brand,
        responseCode: value.variables.responseCode,
        campaign: campaign,
        campaginDescription: value.variables.campaign,
        orders: value.variables.orders,
        screenshot: screenshotUrl,
        startUrl: value.startUrl,
        endUrl: value.endUrl,
        browser: value.browser,
        startDate: value.variables.startDate,
        endDate: value.variables.endDate,
        testDate: value.dateExecutionFinished,
        emailAddress: value.variables.emailUser,
        lpItemCode: value.variables.lpItemCode,
        lpPrice: value.variables.lpPrice,
        lpShipping: value.variables.lpShipping,
        confOrderId: value.variables.confOrderId,
        confItemCode: value.variables.confItemCode,
        confPrice: value.variables.confPrice,
        confShipping: value.variables.confShipping,
        apiDate: formattedDate,
      });
      newActivePage.save(function (error, document) {
        if (error) console.error(error);
        console.log("doc", document);
      });
    });

    let activeLength = activePagesArray.length;
    if (activeLength > 0) {
      // Active Pages
      let giOutput = csv.createCSV(activePagesArray);

      // Base64 encode so that can go via email
      let giPageCSV = base64encode(giOutput);

      // Send the active pages
      // notify.sendEmail({
      //   emailTeam: "activePagesTeam",
      //   emailType: "activePages",
      //   fileLength: activeLength,
      //   attachmentContent: giPageCSV,
      //   attachmentName: "active_pages_all.csv",
      // });
      console.log("activePages email sent");
    }

    Test.findByIdAndUpdate(
      testHash,
      { activePages: activeLength },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
        }
      }
    );

    //return activePagesArray;
  },
  getRedirectsResults: (results, currentTestId, testHash) => {
    const filePath = path.resolve(__dirname, "../uploads");

    let testResultsArray = [];

    // Passing Results Loop
    _.forEach(results, function (value) {
      var str = value.endUrl;
      var expired = str.includes("ExpiryPage");

      testResultsArray.push({
        brand: value.variables.brand,
        responseCode: value.variables.responseCode,
        expired: expired,
        startUrl: value.startUrl,
        endUrl: value.endUrl,
        folder: value.variables.folder,
      });
    });

    let inputObject = {
      resultsArray: testResultsArray,
      currentTestId,
    };
    fileService.createCSVFile(inputObject);

    const expiredResults = _.filter(testResultsArray, function (o) {
      return o.expired === true;
    });
    let expiredResultsLength = expiredResults.length;

    let activeLength = testResultsArray.length;
    if (activeLength > 0) {
      // Active Pages
      let giOutput = csv.createCSV(testResultsArray);
      // Base64 encode so that can go via email
      let giPageCSV = base64encode(giOutput);
      // Send the active pages
      // notify.sendEmail({
      //   emailTeam: "notification",
      //   emailType: "redirectResults",
      //   fileLength: activeLength,
      //   attachmentContent: giPageCSV,
      //   attachmentName: "redirect_tests_all.csv",
      // });
      console.log("redirectResults email sent");
    }

    Test.findByIdAndUpdate(
      testHash,
      {
        redirectPages: activeLength,
        activePages: "n/a",
        expiredPages: expiredResultsLength,
        failedPages: "n/a",
        dateCompleted: new Date(),
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
        }
      }
    );
  },
  getCampaigns: (results) => {
    let activeCampaigns = [];

    // Passing Results Loop
    _.forEach(results, function (value) {
      let campaign = value.CAMPAIGNID;
      let campaignName = campaign.substring(0, 4);
      activeCampaigns.push({
        campaign: campaignName,
        responseCode: value.CAMPAIGNID,
        campaignDesc: value.CAMPAIGNNAME,
        startDate: value.CAMPAIGNDATE,
        endDate: value.CAMPAIGNENDDATE,
        orders: value.Orders,
      });

      // let found = CampaignModel.find({ campaign: campaignName });
      // console.log({ found });

      //const filter = { campaign: campaignName };
      //const update = { responseCode: value.CAMPAIGNID };
      //let doc = CampaignModel.findOneAndUpdate(filter, update);

      CampaignModel.findOneAndUpdate(
        { campaign: campaignName },
        { responseCode: value.CAMPAIGNID },
        function (err, result) {
          if (err) {
            // res.send(err);
            console.log({ err });
          } else {
            // res.send(result);
            console.log({ result });
          }
        }
      );

      // let newActivePage = new ActivePage({
      //   testId: currentTestId,
      //   brand: value.variables.brand,
      //   responseCode: value.variables.responseCode,
      //   campaign: value.variables.campaign,
      //   orders: value.variables.orders,
      //   screenshot: value.screenshot.original.defaultUrl,
      //   startUrl: value.startUrl,
      //   endUrl: value.endUrl,
      //   browser: value.browser,
      //   startDate: value.variables.startDate,
      //   endDate: value.variables.endDate,
      //   testDate: value.dateExecutionFinished,
      //   emailAddress: value.variables.emailUser,
      //   lpItemCode: value.variables.lpItemCode,
      //   lpPrice: value.variables.lpPrice,
      //   lpShipping: value.variables.lpShipping,
      //   confOrderId: value.variables.confOrderId,
      //   confItemCode: value.variables.confItemCode,
      //   confPrice: value.variables.confPrice,
      //   confShipping: value.variables.confShipping,
      //   apiDate: formattedDate,
      // });
      // newActivePage.save(function (error, document) {
      //   if (error) console.error(error);
      //   console.log("doc", document);
      // });
    });

    //console.log("activeCampaigns", activeCampaigns);

    // const filteredArr = activeCampaigns.reduce((acc, current) => {
    //   const x = acc.find((item) => item.campaign === current.campaign);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);

    return activeCampaigns;

    //console.log("u", filteredArr);
    // let activeLength = activePagesArray.length;
    // if (activeLength > 0) {
    //   // Active Pages
    //   let giOutput = csv.createCSV(activePagesArray);

    //   // Base64 encode so that can go via email
    //   let giPageCSV = base64encode(giOutput);

    //   // Send the active pages
    //   notify.sendEmail({
    //     emailTeam: "activePagesTeam",
    //     emailType: "activePages",
    //     fileLength: activeLength,
    //     attachmentContent: giPageCSV,
    //     attachmentName: "active_pages_all.csv",
    //   });
    //   console.log("activePages email sent");
    // }

    // Test.findByIdAndUpdate(
    //   testHash,
    //   { activePages: activeLength },
    //   function (err, docs) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log("Updated User : ", docs);
    //     }
    //   }
    // );

    //return activePagesArray;
  },
};

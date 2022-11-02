const GhostInspector = require("ghost-inspector")(
  "34705897a4502d29e6fdc085ac6fe7a1517eaf61"
);
const notify = require("./notify.service");
const Test = require("../models/Test");

module.exports = {
  runGhostInspector: (testConfig) => {
    console.log("testC", testConfig);
    const options = {
      dataFile: testConfig.dataFile,
    };
    GhostInspector.executeTest(
      testConfig.testId,
      options,
      function (err, results, passing) {
        if (err) {
          notify.sendEmail({
            emailTeam: "error",
            emailType: "applicationError",
          });
          return err;
        } else {
          console.log("r", results);
          return results;
        }
      }
    );
  },
  completeTest: (currentTestId) => {
    console.log("completeTest", currentTestId);

    Test.find({ testId: currentTestId })
      .sort({})
      .limit(1)
      .exec(function (err, result) {
        console.log("res", result);
        //  res.render("test_run.ejs", {
        //    data: result, // get the user out of session and pass to template
        //    user: req.oidc.user, // get the user out of session and pass to template
        //    moment: moment,
        //  });

        // Send the active pages
        notify.sendEmail({
          emailTeam: "ux",
          emailType: "testComplete",
          fileLength: "0",
          //attachmentContent: giPageCSV,
          //attachmentName: "expired_pages_all.csv",
          data: result[0],
        });
      });
  },
};

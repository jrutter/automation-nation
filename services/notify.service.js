// Third Party Plugins
var postmark = require("postmark");
var client = new postmark.ServerClient("2946d2e3-f082-4b66-b478-d9d49baf0b38");

// Expected input body

module.exports = {
  sendEmail: function (inputData) {
    let dynSubject, emailBody;
    switch (inputData.emailType) {
      case "testKickOff":
        dynSubject = "Kicking Off " + inputData.fileLength;
        emailBody = `The automted tests are kicking off and you will receive an email with the pass/fails. The attached file is a list of what will be tested.`;
        break;

      case "failedResults":
        dynSubject = "Automated Testing Failures: " + inputData.fileLength;
        emailBody = `
          Please see attached CSV of failures.
          Thanks, Digital UX Team
          `;
        break;

      case "activePages":
        dynSubject =
          "Current Active Landing Pages Report:" + inputData.fileLength;
        emailBody = `
          Good Day to you,
          Please see the attached list of current active landing pages by brand.
          Thanks, Digital UX Team
          `;
        break;

      case "expiredPages":
        dynSubject =
          "Current Expired Landing Pages Report:" + inputData.fileLength;
        emailBody = `
          Top of the morning to ya,
          Please see the attached list of current expired landing pages by brand.
          Thanks, Digital UX Team
          `;
        break;

      case "redirectResults":
        dynSubject = "Redirect Test Results:" + inputData.fileLength;
        emailBody = `
          Howdy, Here is a list of redirects tests from GI. 
          `;
        break;

      case "applicationError":
        dynSubject = "There's been an application error";
        emailBody = `There's been an application error, please try again.`;
    }

    let emailUsers;
    if (inputData.emailTeam === "compliance") {
      emailUsers = "jake.rutter@archwaypi.com,Sambamurthy.B@redgrapebs.com";
      //emailUsers =
      //  "jake.rutter@archwaypi.com, ashley.keegan@lionstone.com, Michael.Arton@directwinesinc.com";
    } else if (inputData.emailTeam === "ux") {
      //emailUsers = "jake.rutter@archwaypi.com";
      emailUsers =
        "jake.rutter@archwaypi.com, jennifer.masserano@archwaypi.com,Shiyam.Sundar@redgrapebs.com, Thomas.Fischetti@directwinesinc.com, Jayne.Merkel@directwinesinc.com, Sambamurthy.B@redgrapebs.com";
    } else if (inputData.emailTeam === "notification") {
      emailUsers = "jake.rutter@archwaypi.com, Sambamurthy.B@redgrapebs.com";
      //emailUsers =
      //  "jake.rutter@archwaypi.com, jennifer.masserano@archwaypi.com, simon.brady@archwaypi.com, ashley.keegan@lionstone.com";
    } else if (inputData.emailTeam === "activePagesTeam") {
      //emailUsers = "jake.rutter@archwaypi.com";
      emailUsers =
        "jake.rutter@archwaypi.com, jennifer.masserano@archwaypi.com,Shiyam.Sundar@redgrapebs.com,Sambamurthy.B@redgrapebs.com, Jayne.Merkel@directwinesinc.com, Michelle.Ardizone@directwinesinc.com, Arunkumar.S@redgrapebs.com";
    } else if (inputData.emailTeam === "expiredPagesTeam") {
      //emailUsers = "jake.rutter@archwaypi.com";
      emailUsers =
        "jake.rutter@archwaypi.com, Jayne.Merkel@directwinesinc.com, Michelle.Ardizone@directwinesinc.com, Maryann.Williams@directwinesinc.com, sarah.somarribas@directwinesinc.com, ashley.robson@directwinesinc.com, jillian.simpson@directwinesinc.com";
    } else if (
      inputData.emailTeam === "error" ||
      inputData.emailTeam === "admin"
    ) {
      emailUsers = "jake.rutter@archwaypi.com";
    }
    console.log("inputData.emailType", inputData.emailType);

    if (inputData.emailType === "testComplete") {
      client.sendEmailWithTemplate({
        From: "admin@autommate.xyz",
        TemplateId: "19968410",
        To: "jake.rutter@archwaypi.com, jennifer.masserano@archwaypi.com,Shiyam.Sundar@redgrapebs.com,Sambamurthy.B@redgrapebs.com, Jayne.Merkel@directwinesinc.com, Michelle.Ardizone@directwinesinc.com, Arunkumar.S@redgrapebs.com",
        TemplateModel: {
          testId: inputData.data.testId,
          testType: inputData.data.type,
          environment: inputData.data.environment,
          numTests: inputData.data.numTests,
          requestedBy: inputData.data.requestedBy,
          activePages: inputData.data.activePages,
          expiredPages: inputData.data.expiredPages,
          failedPages: inputData.data.failedPages,
        },
      });
    } else {
      client.sendEmail(
        {
          From: "admin@autommate.xyz",
          To: emailUsers,
          Subject: dynSubject,
          TextBody: emailBody,
          Attachments: [
            {
              Name: inputData.attachmentName,
              Content: inputData.attachmentContent,
              ContentType: "text/csv",
            },
          ],
        },
        function (error, success) {
          if (error) {
            console.error("Unable to send via postmark: " + error.message);
          }
          console.info("Sent to postmark for delivery");
        }
      );
    }
  },
};

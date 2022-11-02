const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { auth } = require("express-openid-connect");
const { requiresAuth } = require("express-openid-connect");
const multer = require("multer");
var moment = require("moment");

const uploadController = require("../controllers/upload.controller");
const CampaignController = require("../controllers/campaign.controller");

const Report = require("../models/Report");
const Test = require("../models/Test");

const ExpiredPage = require("../models/ExpiredPage");
const ActivePage = require("../models/ActivePage");
const Result = require("../models/Result");
const Campaign = require("../models/Campaign");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, "testData_" + Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  console.log("f", file.mimetype);
  if (file.mimetype == "text/csv") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
  "/upload/campaigns",
  upload.single("fileName"),
  uploadController.uploadCampaigns
);

router.post("/upload", upload.single("fileName"), uploadController.parseUpload);

router.post(
  "/upload-campaigns",
  upload.single("fileName"),
  CampaignController.parseCampaignUpload
);

router.post("/reports/save/:id", async (req, res) => {
  var updateObj = { comments: req.body.comments };
  Test.findOneAndUpdate(
    { testId: req.params.id },
    updateObj,
    { new: true },
    function (err, result) {
      if (err) {
        //logger.error(modelString + ":edit" + modelString + " - " + err.message);
        //self.emit("item:failure", "Failed to edit " + modelString);
        return;
      }
      res.send(result);
      console.log("saved ma", result);
    }
  );

  // const post = new Post({
  //   title: req.body.title,
  //   content: req.body.content,
  // });
  // await post.save();
  // res.send(post);
});

// router.post("/cart-lp-hook", controller.runTests);

router.get("/", function (req, res) {
  res.render("index.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
});

router.get("/campaigns", CampaignController.getAllCampaigns);

router.get("/trigger", requiresAuth(), function (req, res) {
  console.log("req.user.roles", req.oidc.user);
  res.render("trigger.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
});

router.get("/campaign/sync", requiresAuth(), function (req, res) {
  console.log("req.user.roles", req.oidc.user);
  res.render("campaign.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
});

router.get("/sync", requiresAuth(), function (req, res) {
  console.log("req.user.roles", req.oidc.user);
  res.render("sync_campaign.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
});

router.get("/email", requiresAuth(), function (req, res) {
  res.render("email.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
});

router.get("/status", requiresAuth(), function (req, res) {
  res.render("status.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
});

router.get("/uploading", requiresAuth(), function (req, res) {
  res.render("upload.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
});

router.get("/reports", requiresAuth(), function (req, res) {
  Test.find({})
    .sort({ dateTriggered: -1 })
    .limit(50)
    .exec(function (err, result) {
      console.log("reports", result);
      res.render("reports.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
        pageName: "all",
      });
    });
});

router.get("/reports/validate", requiresAuth(), function (req, res) {
  Test.find({
    type: "validate",
  })
    .sort({ dateTriggered: -1 })
    .limit(50)
    .exec(function (err, result) {
      console.log("reports", result);
      res.render("reports.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
        pageName: "validate",
      });
    });
});

router.get("/reports/cart", requiresAuth(), function (req, res) {
  Test.find({
    type: "cart",
  })
    .sort({ dateTriggered: -1 })
    .limit(50)
    .exec(function (err, result) {
      console.log("reports", result);
      res.render("reports.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
        pageName: "cart",
      });
    });
});

router.get("/reports/order", requiresAuth(), function (req, res) {
  Test.find({
    type: "order",
  })
    .sort({ dateTriggered: -1 })
    .limit(50)
    .exec(function (err, result) {
      console.log("reports", result);
      res.render("reports.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
        pageName: "order",
      });
    });
});

router.get("/reports/lptest", requiresAuth(), function (req, res) {
  Test.find({
    type: "lpTest",
  })
    .sort({ dateTriggered: -1 })
    .limit(50)
    .exec(function (err, result) {
      console.log("reports", result);
      res.render("reports.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
        pageName: "lptest",
      });
    });
});

router.get("/reports/:id", requiresAuth(), function (req, res) {
  Test.find({ testId: req.params.id })
    .sort({})
    .limit(1)
    .exec(function (err, result) {
      console.log("res", result);
      res.render("test_run.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
      });
    });

  // Test.findById(req.params.id).exec(function (err, result) {
  //   console.log("res", result);

  //   res.render("test_run.ejs", {
  //     data: result, // get the user out of session and pass to template
  //     user: req.oidc.user, // get the user out of session and pass to template
  //     moment: moment,
  //   });
  // });
});

// api for active redirects
router.get("/api/active/:id", function (req, res) {
  // remove these from API
  var removeFields = {
    __v: false,
    _id: false,
    orders: false,
    browser: false,
    screenshot: false,
  };

  ActivePage.find({ testId: req.params.id }, removeFields)
    .sort({ testDate: -1 })
    .limit()
    .exec(function (err, result) {
      console.log("res", result);
      res.json(
        result // get the user out of session and pass to template
      );
    });
});

// check by apiDate
router.get("/api/active/:apiDate", function (req, res) {
  // remove these from API
  var removeFields = {
    __v: false,
    _id: false,
    orders: false,
    browser: false,
    screenshot: false,
  };

  ActivePage.find({ apiDate: req.params.apiDate }, removeFields)
    .sort({ testDate: -1 })
    .limit()
    .exec(function (err, result) {
      console.log("res", result);
      res.json(
        result // get the user out of session and pass to template
      );
    });
});

router.get("/reports/:id/all", requiresAuth(), function (req, res) {
  Result.find({ testId: req.params.id })
    .sort({ testDate: -1 })
    .limit()
    .exec(function (err, result) {
      console.log({ result });
      res.render("all_tests.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
      });
    });
});

router.get("/reports/:id/expired", requiresAuth(), function (req, res) {
  ExpiredPage.find({ testId: req.params.id })
    .sort({ testDate: -1 })
    .limit()
    .exec(function (err, result) {
      console.log("res", result);
      res.render("expired_tests.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
      });
    });
});

router.get("/reports/:id/active", requiresAuth(), function (req, res) {
  ActivePage.find({ testId: req.params.id })
    .sort({ testDate: -1 })
    .limit()
    .exec(function (err, result) {
      console.log({ result });
      res.render("active_tests.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
      });
    });
});

router.get("/reports/:id/fail", requiresAuth(), function (req, res) {
  Result.find({ testId: req.params.id })
    .sort({ testDate: -1 })
    .limit()
    .exec(function (err, result) {
      console.log("res", result);

      res.render("failed_tests.ejs", {
        data: result, // get the user out of session and pass to template
        user: req.oidc.user, // get the user out of session and pass to template
        moment: moment,
      });
    });
});
// router.get("/tests", requiresAuth(), function (req, res) {
//   Test.find({}, function (err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(result);
//     }
//   });
// });

router.get("/expired", requiresAuth(), function (req, res) {
  ExpiredPage.find({}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
  //res.render("reports.ejs", {
  //   user: req.oidc.user, // get the user out of session and pass to template
  // });
});

router.get("/profile", requiresAuth(), (req, res) => {
  res.render("profile.ejs", {
    user: req.oidc.user, // get the user out of session and pass to template
  });
  // res.send(JSON.stringify(req.oidc.user));
});

//{"nickname":"jake.rutter","name":"jake.rutter@archwaypi.com","picture":"https://s.gravatar.com/avatar/97f3932d5749d49be02936e462385d48?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fja.png","updated_at":"2021-03-05T15:46:11.236Z","email":"jake.rutter@archwaypi.com","email_verified":false,"sub":"auth0|6042524238732f006aa6aded"}

// router.get('/list/:cat', function(req, res) {
//     let searchQ = {}
//     let teamQuery = req.params.cat;

//     if (teamQuery === 'team') {
//       searchQ = {'team': req.user.team}
//     } else if (teamQuery === 'user' && req.user) {
//       searchQ = {'email': req.user.local.email}
//     }
//     else {
//       searchQ = {}
//     }

//     axios.get('https://api.mlab.com/api/1/databases/standup/collections/status',
//     {
//       params: {
//         apiKey: 'lAsBHd1474tcG5UNO_KlBFCb5nUWEtt-',
//         q: searchQ
//       }
//     }).then(function (response) {
//       res.render('list.ejs',
//       {
//         data: response.data,
//         user : req.user,
//         moment: moment
//       });
//     }).catch(function (error) {
//     })

// });

module.exports = router;

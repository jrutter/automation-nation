// Setup Express Server and Body Parser
const express = require("express");
const fs = require("fs");
const path = require("path");
const { auth } = require("express-openid-connect");
const { requiresAuth } = require("express-openid-connect");
const fileupload = require("express-fileupload");
const multer = require("multer");
const mongoose = require("mongoose");

// Database Config
const configDB = require("./config/database.js");
mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

//Get the default connection
const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", configDB.url);
});

db.on("error", (err) => {
  console.error("connection error:", configDB.url);
});

// Setup heroku
const PORT = process.env.PORT || 5000;
const app = express();

console.log("env", app.get("env"));
if (app.get("env") === "development") {
  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: "a long, randomly-generated string stored in env",
    baseURL: "http://localhost:5000",
    clientID: "05oRXuzhUpsvquwaZctM5VUabT6gOsLU",
    issuerBaseURL: "https://directwines.auth0.com",
  };
  app.use(auth(config));
} else {
  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: "a long, randomly-generated string stored in env",
    baseURL: "https://dwi-automated-tests.herokuapp.com/",
    clientID: "05oRXuzhUpsvquwaZctM5VUabT6gOsLU",
    issuerBaseURL: "https://directwines.auth0.com",
  };
  app.use(auth(config));
}

// Handle auth failure error messages
// app.use(function (req, res, next) {
//   if (req && req.query && req.query.error) {
//     req.flash("error", req.query.error);
//   }
//   if (req && req.query && req.query.error_description) {
//     req.flash("error_description", req.query.error_description);
//   }
//   next();
// });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);
app.use(express.static(path.join(__dirname, "data")));
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs"); // set up ejs for templating

// Routes
var index = require("./routes/index");
app.use("/", index);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something Broke!");
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

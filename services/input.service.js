const _ = require("lodash");
const notify = require("./notify.service");
const converter = require("json-2-csv");
const { base64encode, base64decode } = require("nodejs-base64");
const fs = require("fs");

const ActivePage = require("../models/ActivePage");
const ExpiredPage = require("../models/ExpiredPage");
const Test = require("../models/Test");
const Result = require("../models/Result");

const brand = require("../services/brand.service");

module.exports = {
  createLandingPageFile: (campaigns, testSuite, testEnv, numOrders) => {
    //console.log("numOrders", numOrders);
    // console.log("campaigns", campaigns.length);
    let testArray = [];
    const filterbyOrder = _.filter(campaigns, function (i) {
      return i.Orders >= numOrders && i.DWACTIVITY == "RECR";
    });

    console.log("filterByOrder", filterbyOrder.length);

    // console.log("createLandingPageFile", filterbyOrder);
    _.forEach(filterbyOrder, function (value) {
      let brandService = brand.createBrandObject(value, testEnv);

      // Push new objects into new array
      testArray.push({
        brand: brandService.brand,
        responseCode: value.CAMPAIGNID,
        campaign: value.CAMPAIGNNAME,
        website: brandService.website,
        startDate: value.CAMPAIGNDATE,
        endDate: value.CAMPAIGNENDDATE,
        orders: value.Orders,
      });
    });

    const filterOutMacys = _.filter(testArray, function (v) {
      return v.brand !== "MCY";
    });
    return filterOutMacys;
  },
  createLandingPageOrderFile: (campaigns, testSuite, testEnv, numOrders) => {
    //console.log("numOrders", numOrders);

    let wineryDirectStates = [
        "PA",
        "KS",
        "ME",
        "VT",
        "SD",
        "MD",
        "GA",
        "MT",
        "OK",
        "TN",
      ],
      colonieWarehouseStates = ["DC", "MD", "ME", "NY", "PA", "VT"],
      lakeForestWarehouseStates = ["FL", "GA", "KS", "MT", "OK", "WA"],
      mainZipCodes = ["90210", "12345", "06903", "07096", "80013", "05401"],
      testArray = [];
    const filterbyOrder = _.filter(campaigns, function (i) {
      return i.Orders >= numOrders;
    });

    // console.log("createLandingPageFile", filterbyOrder);
    _.forEach(filterbyOrder, function (value) {
      let brandService = brand.createBrandObject(value, testEnv);

      mainZipCodes.forEach(
        (
          zipCode // Push new objects into new array
        ) =>
          testArray.push({
            brand: brandService.DWBRAND,
            responseCode: value.CAMPAIGNID,
            campaign: value.CAMPAIGNNAME,
            website: brandService.website,
            startDate: value.CAMPAIGNDATE,
            endDate: value.CAMPAIGNENDDATE,
            orders: value.Orders,
            zipCode,
          })
      );
    });

    // console.log("testArray", testArray);

    const filterOutMacys = _.filter(testArray, function (v) {
      return v.brand !== "MCY";
    });

    return filterOutMacys;
  },
  createRedirectTestFile: (campaigns) => {
    let testArray = [];

    _.forEach(campaigns, function (value) {
      let brandService = brand.createBrandObject(value, testEnv);

      // Push new objects into new array
      testArray.push({
        brand: brandService.DWBRAND,
        responseCode: value.CAMPAIGNID,
        website: brandService.website,
        folder: value.PARENT_FOLDER_ID,
      });
    });
    console.log("testArray", testArray);
    return testArray;
  },
};

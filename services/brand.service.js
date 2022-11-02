module.exports = {
  createBrandObject: (value, testEnv) => {
    let brandOject = {};

    // console.log("testEnv", testEnv);

    let preFix;
    switch (testEnv) {
      case "softlaunch":
        // code block
        preFix = "softlaunch.";
        break;
      case "production":
        // code block
        preFix = "www.";
        break;
      default:
      // code block
    }

    // console.log("preFix", preFix);

    if (
      value.DWBRAND === "WSJ" ||
      value.DWBRAND === "100001" ||
      value.DWBRAND === "Wall Street Journal"
    ) {
      brandOject.website = preFix + "wsjwine.com";
      brandOject.brand = "WSJ";
    } else if (
      value.DWBRAND === "4S" ||
      value.DWBRAND === "100005" ||
      value.DWBRAND === "Laithwaites" ||
      value.DWBRAND === "4 Seasons"
    ) {
      if (value.DWBUSINESSPARTNER === "NATGEO") {
        brandOject.website = preFix + "natgeowine.com";
        brandOject.brand = "NGO";
      } else if (value.DWBUSINESSPARTNER === "NPR") {
        brandOject.website = preFix + "nprwineclub.org";
        brandOject.brand = "NPR";
      } else if (value.DWBUSINESSPARTNER === "TCM") {
        brandOject.website = "shop.tcmwineclub.com";
        brandOject.brand = "TCM";
      } else {
        brandOject.website = preFix + "laithwaites.com";
        brandOject.brand = "LAW";
      }
    } else if (
      value.DWBRAND === "VIRGIN" ||
      value.DWBRAND === "100003" ||
      value.DWBRAND === "Virgin"
    ) {
      brandOject.website = preFix + "virginwines.com";
      brandOject.brand = "VIR";
    } else if (value.DWBRAND === "MACYS" || value.DWBRAND === "100020") {
      brandOject.website = preFix + "macyswinecellar.com";
      brandOject.brand = "MCY";
    } else if (value.DWBRAND === "TCM" || value.DWBRAND === "100019") {
      brandOject.website = "shop.tcmwineclub.com";
      brandOject.brand = "TCM";
    } else if (
      value.DWBRAND === "Myst" ||
      value.DWBRAND === "100007" ||
      value.DWBRAND === "Mystery Case Club"
    ) {
      brandOject.website = preFix + "mysterycasewine.com";
      brandOject.brand = "MYS";
    } else {
      brandOject.website = preFix + "laithwaites.com";
      brandOject.brand = "LAW";
    }
    return brandOject;
  },
};

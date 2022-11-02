var soap = require("soap");

exports.parseUpload = function (req, res) {
  var url = "https://api.bronto.com/v4?wsdl";
  var args = { name: "value" };
  soap.createClient(url, function (err, client) {
    client.MyFunction(args, function (err, result) {
      console.log(result);
    });
  });
};

var productArray = [];
$(".gi-select-wine").each(function (index) {
  var productBom = $(this).data("bom");
  productArray.push({
    itemCode: productBom,
  });
});
return productArray;

var productArray = [];
$(".gi-select-wine").each(function (index) {
  var product = $(this).val();
  var pJson = JSON.parse(product);
  console.log("pJson", pJson.product);
});
return productArray[0];

var productArray = [];
$(".gi-select-wine").each(function (index) {
  var product = $(this).val();
  var pJson = JSON.parse(product);
  productArray.push({
    itemCode: pJson.product.skus[0].itemCode,
    salePrice: pJson.product.skus[0].salePrice,
    listPrice: pJson.product.skus[0].listPrice,
    numberOfBottles: pJson.product.skus[0].numberOfBottles,
    itemName: pJson.product.name,
    salesActivity: pJson.product.salesActivity,
  });
});
return productArray[0].itemCode;

// Check if headers available on screen
var header1 = $(".section-header").is(":visible");
var header2 = $(".section-header-1").is(":visible");

if (header1 || header2) {
  return true;
}

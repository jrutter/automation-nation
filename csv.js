// require csvtojson module
const CSVToJSON = require('csvtojson');
const _ = require('lodash');
const converter = require('json-2-csv');


let csvArray = [];
let csvOutput;
// convert users.csv file to JSON array
CSVToJSON().fromFile('data/WP060_Active_Campaigns.csv')
    .then(campaigns => {

        

        const filterView = _.filter(campaigns, function(o) { return o.DWUS_BrandId === 'WSJ'; });

        
        _.forEach(filterView, function(value) {
            let website = '';
            if(value.DWUS_BrandId === 'WSJ'){
                website = 'www.wsjwine.com'
            }
            csvArray.push({
                'brand': value.DWUS_BrandId,
                'responseCode': value.CampaignId,
                'website': website,
                'startDate': value.CampaignDate,
                'endDate': value.CampaignEndDate

            })
          });


          converter.json2csv(csvArray, (err, csvOutput) => {
            if (err) {
                throw err;
            }
        
            // print CSV string
            console.log(csvOutput);
        });

    }).catch(err => {
        // log error if any
        console.log(err);
    });


    
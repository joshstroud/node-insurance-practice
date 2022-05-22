var fs = require('fs');
var parse = require('csv-parse');
const path = require('path');

const zipsPath = './files/zips.csv';
const slcspPath = './files/slcsp.csv';

const inputZips = [];
const zipsRateAreasLookup = [];
const rateAreas = [];

fs.createReadStream(slcspPath)
    .pipe(parse.parse({ delimiter: ',' }))
    .on('data', function (csvrow) {
        // console.log(csvrow);
        //do something with csvrow
        inputZips.push(csvrow);
    })
    .on('end', function () {
        //do something with csvData
        console.log(inputZips);
        // console.log('done');
    })
    .then(
        const inputHeaders = inputZips;
        console.log(inputZips);
    )



fs.createReadStream(zipsPath)
    .pipe(parse.parse({ delimiter: ',' }))
    .on('data', function (csvrow) {
        // console.log(csvrow);
        
        zipsRateAreasLookup.push(csvrow);
    })
    .on('end', function () {
        //do something with csvData
        // console.log(zipsRateAreas);
        // console.log('done');
    });

    // const findRateArea = (zip) => {


    //     fs.createReadStream(zipsPath)
    //         .pipe(parse.parse({ delimiter: ':' }))
    //         .on('data', function (csvrow) {
    //             console.log(csvrow);
    //             //do something with csvrow
    //             csvData.push(csvrow);
    //         })
    //         .on('end', function () {
    //             //do something with csvData
    //             // console.log(csvData);
    //             console.log('done');
    //         });
    // }
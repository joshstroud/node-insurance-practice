var fs = require('fs');
var parse = require('csv-parse');
const path = require('path');

const zipsPath = './files/zips.csv';

var csvData = [];




fs.createReadStream(zipsPath)
    .pipe(parse.parse({ delimiter: ':' }))
    .on('data', function (csvrow) {
        // console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);
    })
    .on('end', function () {
        //do something with csvData
        console.log(csvData);
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
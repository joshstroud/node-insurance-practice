var fs = require('fs');
var parse = require('csv-parse');
const path = require('path');

const zipsPath = './files/zips.csv';
const slcspPath = './files/slcsp.csv';
const plansPath = './files/plans.csv';

let inputZips = [];
let rateAreasLookup = [];
let rateAreas = [];
let plansLookup = [];

function readCSV(filePath) {
    const arr = [];
    const stream = fs.createReadStream(filePath)
        .pipe(parse.parse({ delimiter: ',' }));

    return new Promise((resolve, reject) => {
        stream.on('data', (csvRow) => {
            arr.push(csvRow)
        });
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(arr));
    })
}

// returns promise that finishes after all CSV's are read into memory
function readAllCSVs() {
    return readCSV(zipsPath)
        .then(csvArr => {
            rateAreasLookup = csvArr;
            // console.log(inputZips);
            return readCSV(slcspPath);
        })
        .then(csvArr => {
            inputZips = csvArr;
            // console.log(rateAreasLookup);
            return readCSV(plansPath);
        })
        .then(csvArr => {
            plansLookup = csvArr;
            // console.log(plansLookup);
            console.log('Read all CSVs into memory.');
        });
}

// remember that zip can be in more than one county
function findRateArea(zip, rateAreasLookupArr) {
    let matches = rateAreasLookupArr.filter(row => zip === row[0]);
    // console.log(matches);

    // if multiple rate areas for a given zip, return null
    if (matches.length > 1) {
        let uniqueRateAreas = new Set();
        for (let i = 0; i < matches.length; i++) {
            let matchRateArea = matches[i][4];
            uniqueRateAreas.add(matchRateArea);
        }

        if (uniqueRateAreas.size > 1) {
            return null;
        }
    }

    let rateArea = [];
    let state = matches[0][1];
    let rateAreaCode = matches[0][4];
    rateArea.push([state, rateAreaCode]);
    return rateArea;
}

function main() {
    readAllCSVs()
        .then(() => {
            // console.log(rateAreasLookup);
            console.log(findRateArea('65608', rateAreasLookup));
        })
}

main();
// fs.createReadStream(slcspPath)
//     .pipe(parse.parse({ delimiter: ',' }))
//     .on('data', function (csvrow) {
//         // console.log(csvrow);
//         //do something with csvrow
//         inputZips.push(csvrow);
//     })
    // .on('end', function () {
    //     //do something with csvData
    //     // console.log(inputZips);
    //     // console.log('done');
    // })

    

// fs.createReadStream(zipsPath)
//     .pipe(parse.parse({ delimiter: ',' }))
//     .on('data', function (csvrow) {
//         // console.log(csvrow);
        
//         rateAreasLookup.push(csvrow);
//     })
//     .on('end', function () {
//         //do something with csvData
//         // console.log(zipsRateAreas);
//         // console.log('done');
//     });

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
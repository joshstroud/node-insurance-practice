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
let slcspRates = [];
let outputZips = [];

SILVER_METAL_LEVEL = 'Silver';

// COMMENTS
// run with 'node findRates' in terminal

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
            return readCSV(slcspPath);
        })
        .then(csvArr => {
            inputZips = csvArr;
            return readCSV(plansPath);
        })
        .then(csvArr => {
            plansLookup = csvArr;
        });
}

function findRateArea(zip) {
    let matches = rateAreasLookup.filter(row => zip === row[0]);

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

function findAllRateAreas() {
    for (let idx = 1; idx < inputZips.length; idx++) {
        let inputZip = inputZips[idx][0];

        let rateArea = findRateArea(inputZip);

        if (rateArea) {
            rateArea = rateArea[0];
        }
        rateAreas.push(rateArea)
            
    }
}

function findAllSLCSPPlans() {
    rateAreas.forEach((rateArea, idx) => {
        if (idx === 0) {
            return;
        }

        let slcspRate = findSLCSPPlan(rateArea);

        if (slcspRate === null || slcspRate === undefined) {
            slcspRate = '';
        }
        inputZips[idx][1] = slcspRate;
    })

    outputZips = inputZips;
}

function findSLCSPPlan(inputRateArea) {
    if (inputRateArea === null) {
        return '';
    }

    let targetState = inputRateArea[0];
    let targetRateArea = inputRateArea[1];
    
    let silverPlans = plansLookup.filter(row => {
        let state = row[1];
        let metalLevel = row[2];
        let rateArea = row[4];


        return  state === targetState &&
                rateArea === targetRateArea &&
                metalLevel === SILVER_METAL_LEVEL
    })

    if (silverPlans.length === 0) {
        return '';
    }

    let silverRates = silverPlans.map(plan => plan[3]);
    silverRates.sort();

    let lowestRate = silverRates[0];
    let secondLowestRate;
    for (let i = 0; i < silverRates.length; i++) {
        let currentRate = silverRates[i];
        
        if (lowestRate !== currentRate) {
            secondLowestRate = currentRate;
            break;
        }
    }

    return secondLowestRate;
}

function printRates() {
    outputZips.forEach(row => {
        console.log(`${row[0]}, ${row[1]}`);
    })
}

function main() {
    readAllCSVs()
        .then(() => {
            findAllRateAreas();
            findAllSLCSPPlans();
            printRates();
        })
}

main();
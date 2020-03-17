const axios = require('axios');
const CSV = require('csv-string');
const fs = require('fs');
const endpoint = 'https://covid.ourworldindata.org/data/full_data.csv';

const name = [
  'date',
  'location',
  'newCases',
  'newDeaths',
  'totCases',
  'totDeaths',
];
const dateCol = 0;
const locCol = 1;
const newCaseCol = 2;
const newDeathCol = 3;
const totCaseCol = 4;
const totDeathCol = 5;

async function getAllDataMatrix() {
  const matrix = [];
  try {
    const res = await axios.get(endpoint);
    CSV.forEach(res.data, ',', function(row, index) {
      matrix.push(row);
    });
    return matrix;
  } catch (err) {
    console.log('Error retrieving all data', err);
  }
}

function newLoc(allData, row) {
  return row === 1 || allData[row][locCol] !== allData[row - 1][locCol];
}

function getData(allData, row, col) {
  colData = allData[row][col];
  return colData === '' ? 0 : parseInt(colData);
}

function addDataToLoc(allData, locData, row) {
  locData.data.push({
    date: allData[row][dateCol],
    newCases: getData(allData, row, newCaseCol),
    newDeaths: getData(allData, row, newDeathCol),
    totCases: getData(allData, row, totCaseCol),
    totDeaths: getData(allData, row, totDeathCol),
  });
}

function writeJSON(json) {
  fs.writeFile(__dirname + '/../data/all-data.json', json, 'utf8', function(
    err,
  ) {
    if (err) {
      return console.log(
        'Error occured writing JSON to all-data.json file',
        err,
      );
    }
    console.log('JSON has been saved to all-data.json file');
  });
}

function getCountryCodes() {
  const data = fs.readFileSync(__dirname + '/../data/country-codes.json');
  return JSON.parse(data);
}

async function getJSON() {
  const json = [];
  const allData = await getAllDataMatrix();
  const countryCodes = getCountryCodes();
  let index = -1;
  for (let row = 1; row < allData.length; row++) {
    if (newLoc(allData, row)) {
      index++;
      locData = {data: []};
      const countryName = allData[row][locCol];
      const country = countryCodes.find(country => country.name == countryName);
      if (!country) console.log(countryName + ' not found.');
      locData['location'] = countryName;
      locData.code = country ? country.code : '--';
      addDataToLoc(allData, locData, row);
      json.push(locData);
    } else {
      locData = json[index];
      addDataToLoc(allData, locData, row);
    }
  }
  writeJSON(JSON.stringify(json));
  return json;
}

module.exports = {
  getJSON,
};

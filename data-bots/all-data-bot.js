const axios = require('axios');
const CSV = require('csv-string');
const fs = require('fs');
const helper = require('./helper-bot.js');
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

function newLoc(allData, row) {
  return row === 1 || allData[row][locCol] !== allData[row - 1][locCol];
}

function getData(allData, row, col) {
  const colData = allData[row][col];
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

async function getJSON() {
  const json = [];
  const allData = await helper.getMatrixFromCSV(endpoint);
  let index = -1;
  for (let row = 1; row < allData.length; row++) {
    if (newLoc(allData, row)) {
      index++;
      locData = {data: []};
      const countryName = allData[row][locCol];
      locData['location'] = countryName;
      addDataToLoc(allData, locData, row);
      json.push(locData);
    } else {
      locData = json[index];
      addDataToLoc(allData, locData, row);
    }
  }
  writeJSON(JSON.stringify(json));
  helper.injectPopData(json);
  helper.injectCodes(json);
  return json;
}

module.exports = {
  getJSON,
};

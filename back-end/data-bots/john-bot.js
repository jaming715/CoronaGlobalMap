const axios = require('axios');
const CSV = require('csv-string');
const fs = require('fs');
const helper = require('./helper-bot.js');
const endpoint =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-16-2020.csv';
const provCol = 0;
const locCol = 1;
const dateCol = 2;
const totCaseCol = 3;
const totDeathCol = 4;
const totRecCol = 5;
const naming = [
  'province',
  'location',
  'date',
  'totCases',
  'totDeaths',
  'totRecovered',
];

function fixLocation(loc) {
  switch (loc) {
    case 'Korea, South':
      loc = 'South Korea';
      break;
    case 'US':
      loc = 'United States';
      break;
    case 'Taiwan*':
      loc = 'Taiwan';
      break;
    case 'Czechia':
      loc = 'Czech Republic';
      break;
    case 'North Macedonia':
      loc = 'Macedonia';
      break;
    //TODO: verify these Congo cases
    case 'Congo (Kinshasa)':
      loc = 'Democratic Republic of Congo';
      break;
    case 'Congo (Brazzaville)':
      loc = 'Congo';
      break;
    case 'The Bahamas':
      loc = 'Bahamas';
      break;
    default:
    //
  }
  return loc;
}

function getLocation(data, row) {
  let loc = fixLocation(data[row][locCol]);
  return loc;
}

function getInt(data, row, col) {
  const value = data[row][col];
  return value === '' ? 0 : parseInt(value);
}

async function getJSON() {
  const json = [];
  const data = await helper.getMatrixFromCSV(endpoint);
  for (let row = 1; row < data.length; row++) {
    const loc = getLocation(data, row);
    let country = json.find(e => e.location === loc);
    if (country) {
      country.totCases += getInt(data, row, totCaseCol);
      country.totDeaths += getInt(data, row, totDeathCol);
      country.totRecovered += getInt(data, row, totRecCol);
    } else {
      country = {};
      country.location = loc;
      country.date = data[row][dateCol];
      country.totCases = getInt(data, row, totCaseCol);
      country.totDeaths = getInt(data, row, totDeathCol);
      country.totRecovered = getInt(data, row, totRecCol);
      json.push(country);
    }
  }
  helper.injectPopData(json);
  helper.injectCodes(json);
  // console.log(json[0]);
  return json;
}
// getJSON();

module.exports = {
  getJSON,
};

const CSV = require('csv-string');
const fs = require('fs');
const helper = require('./helper-bot.js');
const endpoint = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/`;

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

function addWorld(countries) {}

function getNumbers(data, row) {
  if (!data[row]) return {};
  return {
    cases: getInt(data, row, totCaseCol),
    deaths: getInt(data, row, totDeathCol),
    recoveries: getInt(data, row, totRecCol),
  };
}

function addCases(country, data, prevData) {}

async function getJSON() {
  const json = [];
  const d = new Date();
  let dateStr = helper.getDateStr(d);
  const result = await helper.getJohnMatrix(endpoint, dateStr, d);
  const data = result.data;
  // const prevDay = helper.getPrevDay(1, result.date);
  // const prevDayStr = helper.getDateStr(prevDay);
  // const resPrev = await helper.getJohnMatrix(endpoint, prevDayStr, prevDay);
  // const prevData = resPrev.data;
  const world = {
    location: 'World',
    date: data[1][dateCol],
    totCases: 0,
    totDeaths: 0,
    totRecovered: 0,
    provinces: [],
    population: 0,
    code: '--',
    map: 'svg/world-map.svg',
  };
  for (let row = 1; row < data.length - 1; row++) {
    const loc = getLocation(data, row);
    let country = json.find(e => e.location === loc);
    const today = getNumbers(data, row);
    // const yesterday = getNumbers(prevData, row);
    const cases = getInt(data, row, totCaseCol);
    const deaths = getInt(data, row, totDeathCol);
    const recoveries = getInt(data, row, totRecCol);
    let province = data[row][provCol];
    // if (province === 'United States Virgin Islands')
    //   province = 'Virgin Islands';
    if (country && data[row][provCol] !== 'Puerto Rico') {
      country.totCases += today.cases;
      country.totDeaths += today.deaths;
      country.totRecovered += today.recoveries;
      if (province) {
        country.provinces.push({
          name: province,
          totCases: today.cases,
          totDeaths: today.deaths,
          totRecovered: today.recoveries,
        });
      }
    } else {
      country = {};
      country.location = loc;
      if (data[row][provCol] === 'Puerto Rico')
        country.location = 'Puerto Rico';
      country.date = data[row][dateCol];
      country.totCases = today.cases;
      country.totDeaths = today.deaths;
      country.totRecovered = today.recoveries;
      country.provinces = [];
      if (province && province !== country.location) {
        country.provinces.push({
          name: province,
          totCases: today.cases,
          totDeaths: today.deaths,
          totRecovered: today.recoveries,
        });
      }
      json.push(country);
    }
    world.totCases += today.cases;
    world.totDeaths += today.deaths;
    world.totRecovered += today.recoveries;
  }
  json.push(world);
  await helper.injectPopData(json);
  await helper.injectCodes(json);
  await helper.injectMaps(json);
  // await helper.injectUnitedStateCodes(json);
  // await helper.writeJSON(json, 'john-data.json');
  // console.log(json.find(e => e.location === 'Afghanistan'));
  return json;
}
// getJSON();

module.exports = {
  getJSON,
};

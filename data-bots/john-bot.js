const CSV = require('csv-string');
const fs = require('fs');
const helper = require('./helper-bot.js');
const endpoint = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/`;

let provCol = 0;
let locCol = 1;
let dateCol = 2;
let totCaseCol = 3;
let totDeathCol = 4;
let totRecCol = 5;
let countyCol = 1;

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

const countryNews = [
  'AR',
  'AU',
  'BR',
  'CA',
  'CO',
  'CZ',
  'FR',
  'GR',
  'HU',
  'ID',
  'IL',
  'JP',
  'LT',
  'MX',
  'NL',
  'NG',
  'PH',
  'PT',
  'RU',
  'RS',
  'SK',
  'ZA',
  'SE',
  'TW',
  'TR',
  'UA',
  'US',
  'AU',
  'BE',
  'BG',
  'CN',
  'CU',
  'EG',
  'DE',
  'HK',
  'IN',
  'IE',
  'IT',
  'LV',
  'MY',
  'MA',
  'NZ',
  'NO',
  'PL',
  'RO',
  'SA',
  'SG',
  'SI',
  'KR',
  'CH',
  'TH',
  'AE',
  'GB',
  'VE',
];

function getLocation(data, row) {
  let loc = fixLocation(data[row][locCol]);
  return loc;
}

function getInt(data, row, col) {
  const value = data[row][col];
  return value === '' ? 0 : parseInt(value);
}

function addWorld(countries) {}

function getData(data, row) {
  if (!data[row]) return {};
  return {
    county: data[row][countyCol],
    province: data[row][provCol],
    date: data[row][dateCol],
    loc: getLocation(data, row),
    cases: getInt(data, row, totCaseCol),
    deaths: getInt(data, row, totDeathCol),
    recoveries: getInt(data, row, totRecCol),
  };
}

function addCases(country, data, prevData) {}

function getWorld(data) {
  return {
    location: 'World',
    date: data[1][dateCol],
    totCases: 0,
    totDeaths: 0,
    totRecovered: 0,
    provinces: [],
    population: 0,
    code: '--',
    map: 'svg/maps/world-map.svg',
  };
}

function getProvince(today) {
  return {
    name: today.province,
    totCases: today.cases,
    totDeaths: today.deaths,
    totRecovered: today.recoveries,
    counties: [],
  };
}

function getCounty(today) {
  return {
    name: today.county,
    totCases: today.cases,
    totDeaths: today.deaths,
    totRecovered: today.recoveries,
  };
}

function addToProvince(province, today) {
  province.totCases += today.cases;
  province.totDeaths += today.deaths;
  province.totRecovered += today.recoveries;
}

function addToCountry(country, province, today) {
  country.totCases += today.cases;
  country.totDeaths += today.deaths;
  country.totRecovered += today.recoveries;
  if (province) {
    addToProvince(province, today);
  } else if (today.province) {
    country.provinces.push(getProvince(today));
  }
}

function getCountry(today) {
  return {
    location: today.loc,
    date: today.date,
    totCases: today.cases,
    totDeaths: today.deaths,
    totRecovered: today.recoveries,
    provinces: [],
  };
}

function addToWorld(world, today) {
  world.totCases += today.cases;
  world.totDeaths += today.deaths;
  world.totRecovered += today.recoveries;
}

function addCounty(country, today) {
  const province = country.provinces.find(e => e.name === today.province);
  province.counties.push(getCounty(today));
}

async function getFormatJSON(data, formatTwo) {
  const json = [];
  const world = getWorld(data);
  for (let row = 1; row < data.length - 1; row++) {
    const today = getData(data, row);
    let country = json.find(e => e.location === today.loc);
    let province =
      country && country.provinces.find(prov => prov.name === today.province);
    let county = today.county;
    if (country) {
      addToCountry(country, province, today);
      if (county && formatTwo) {
        addCounty(country, today);
      }
      if (
        country.location === 'United States' &&
        today.province === 'Puerto Rico'
      ) {
        today.loc = 'Puerto Rico';
        country = getCountry(today);
        json.push(country);
      }
    } else if (today.loc !== 'Puerto Rico') {
      country = getCountry(today);
      if (today.province && today.province !== country.location) {
        country.provinces.push(getProvince(today));
      }
      if (county && formatTwo) {
        addCounty(country, today);
      }
      json.push(country);
    }
    addToWorld(world, today);
  }
  json.push(world);
  await helper.injectPopData(json);
  await helper.injectCodes(json);
  await helper.injectMaps(json);
  await helper.injectUnitedStateCodes(json);
  return json;
}

async function getFormatTwoJSON(data) {
  provCol = 2;
  locCol = 3;
  dateCol = 4;
  totCaseCol = 7;
  totDeathCol = 8;
  totRecCol = 9;
  const json = await getFormatJSON(data, true);
  return json;
}

async function getJSON() {
  let json = [];
  let d = new Date();
  let dateStr = helper.getDateStr(d);
  const result = await helper.getJohnMatrix(endpoint, dateStr, d);
  const data = result.data;
  if (data[0][0] === 'Province/State') {
    json = await getFormatOneJSON(data, false);
  } else {
    json = await getFormatTwoJSON(data);
  }
  // console.log(json.find(e => e.location === 'United States'));
  // const country = json.find(e => e.location === 'United States');
  // const province = country.provinces.find(e => e.name === 'New York');
  // console.log(province);
  return json;
}

module.exports = {
  getJSON,
};

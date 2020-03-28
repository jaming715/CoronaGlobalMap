const axios = require('axios');
const CSV = require('csv-string');
const fs = require('fs').promises;
const path = require('path');

async function writeJSON(json, fileName) {
  try {
    await fs.writeFile(
      __dirname + '/../data/' + fileName,
      JSON.stringify(json),
      'utf8',
    );
    console.log(`JSON has been saved to ${fileName} file`);
  } catch (err) {
    console.log(`Error writing to ${fileName} file`, err);
  }
}

async function getMatrixFromCSV(endpoint) {
  const matrix = [];
  try {
    const res = await axios.get(endpoint);
    CSV.forEach(res.data, ',', function(row, index) {
      matrix.push(row);
    });
    return matrix;
  } catch (err) {
    return err;
  }
}

function getPrevDay(numDays, date) {
  let prevDate = new Date(date.getTime());
  prevDate.setDate(date.getDate() - numDays);
  return prevDate;
}

function getISO(date) {
  const str = date.toISOString();
  const lastCharIndex = str.indexOf('T');
  return str.slice(0, lastCharIndex);
}

function getDateStr(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${month}-${day}-${year}`;
}

async function getJohnMatrix(endpoint, dateStr, date) {
  let res = await getMatrixFromCSV(endpoint + dateStr + '.csv');
  while (!Array.isArray(res)) {
    date = getPrevDay(1, date);
    dateStr = getDateStr(date);
    res = await getMatrixFromCSV(endpoint + dateStr + '.csv');
  }
  const data = res;
  return {data, date};
}

async function readJSONFile(path) {
  try {
    const data = await fs.readFile(path);
    return JSON.parse(data);
  } catch (err) {
    console.log(`Error reading ${path}`, err);
  }
}

async function getCountryPop() {
  const data = await readJSONFile(
    path.join(__dirname, '../data/country-pop.json'),
  );
  return data;
}

async function getCountryCodes() {
  const data = await readJSONFile(
    path.join(__dirname, '../data/country-codes.json'),
  );
  return data;
}

async function getUnitedStateCodes() {
  const data = await readJSONFile(
    path.join(__dirname, '../data/us-state-codes.json'),
  );
  return data;
}

async function injectPopData(countries) {
  const countryPops = await getCountryPop();
  countries.forEach(country => {
    const name = country.location;
    const countryPop = countryPops.find(e => e.country == name);
    // if (!countryPop) console.log(name + ' not found.');
    country.population =
      countryPop && countryPop.population ? parseInt(countryPop.population) : 0;
  });
}

async function injectCodes(countries) {
  const countryCodes = await getCountryCodes();
  countries.forEach(country => {
    const name = country.location;
    const countryCode = countryCodes.find(e => e.name == name);
    // if (!countryCode) console.log(name + ' not found.');
    country.code = countryCode ? countryCode.code : '--';
  });
}

async function injectMaps(countries) {
  const root = path.join(__dirname, '/../public/svg');
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const code = country.code.toLowerCase();
    const exists = await fileExists(`${root}/maps/${code}.svg`);
    if (code !== '--' && exists) {
      country.map = '/svg/maps/' + code + '.svg';
    }
  }
}

async function injectUnitedStateCodes(countries) {
  const stateCodes = await getUnitedStateCodes(countries);
  const us = countries.find(e => e.code === 'US');
  us.provinces.forEach(province => {
    const name = province.name;
    province.code = stateCodes[name];
  });
}

async function fileExists(path) {
  try {
    await fs.access(path, fs.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function getJohnDataFile() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, '../data/john-data.json'),
    );
    return JSON.parse(data);
  } catch (err) {
    console.log('Error reading country codes', err);
  }
}

module.exports = {
  getMatrixFromCSV,
  getJohnMatrix,
  getDateStr,
  injectPopData,
  injectCodes,
  injectMaps,
  injectUnitedStateCodes,
  writeJSON,
  getJohnDataFile,
  getDateStr,
  getPrevDay,
  getISO,
};

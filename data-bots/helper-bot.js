const axios = require('axios');
const CSV = require('csv-string');
const fs = require('fs').promises;

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
  return res;
}

async function getCountryCodes() {
  try {
    const data = await fs.readFile(__dirname + '/../data/country-codes.json');
    return JSON.parse(data);
  } catch (err) {
    console.log('Error reading country codes', err);
  }
}

async function getCountryPop() {
  try {
    const data = await fs.readFile(__dirname + '/../data/country-pop.json');
    return JSON.parse(data);
  } catch (err) {
    console.log('Error reading country codes', err);
  }
}

async function injectPopData(countries) {
  const countryPops = await getCountryPop();
  countries.forEach(country => {
    const name = country.location;
    const countryPop = countryPops.find(e => e.country == name);
    // if (!countryPop) console.log(name + ' not found.');
    country.population = countryPop ? parseInt(countryPop.population) : '--';
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

async function getJohnDataFile() {
  try {
    const data = await fs.readFile(__dirname + '/../data/john-data.json');
    return JSON.parse(data);
  } catch (err) {
    console.log('Error reading country codes', err);
  }
}

module.exports = {
  getMatrixFromCSV,
  getJohnMatrix,
  getCountryCodes,
  getCountryPop,
  getDateStr,
  injectPopData,
  injectCodes,
  writeJSON,
  getJohnDataFile,
};

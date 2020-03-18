const axios = require('axios');
const CSV = require('csv-string');
const fs = require('fs');

async function getMatrixFromCSV(endpoint) {
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

function getCountryCodes() {
  const data = fs.readFileSync(__dirname + '/../data/country-codes.json');
  return JSON.parse(data);
}

function getCountryPop() {
  const data = fs.readFileSync(__dirname + '/../data/country-pop.json');
  return JSON.parse(data);
}

function injectPopData(countries) {
  const countryPops = getCountryPop();
  countries.forEach(country => {
    const name = country.location;
    const countryPop = countryPops.find(e => e.country == name);
    // if (!countryPop) console.log(name + ' not found.');
    country.pop = countryPop ? parseInt(countryPop.population) : '--';
  });
}

function injectCodes(countries) {
  const countryCodes = getCountryCodes();
  countries.forEach(country => {
    const name = country.location;
    const countryCode = countryCodes.find(e => e.name == name);
    // if (!countryCode) console.log(name + ' not found.');
    country.code = countryCode ? countryCode.code : '--';
  });
}

module.exports = {
  getMatrixFromCSV,
  getCountryCodes,
  getCountryPop,
  injectPopData,
  injectCodes,
};

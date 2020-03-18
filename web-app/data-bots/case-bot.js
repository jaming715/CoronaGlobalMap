const axios = require('axios');
const CSV = require('csv-string');
const endpoint = 'https://covid.ourworldindata.org/data/total_cases.csv';

async function getCaseCountMatrix() {
  const matrix = [];
  try {
    const res = await axios.get(endpoint);
    CSV.forEach(res.data, ',', function(row, index) {
      matrix.push(row);
    });
    return matrix;
  } catch (err) {
    console.log('Error retrieving data', err);
  }
}

async function getJSON() {
  const json = [];
  const caseCount = await getCaseCountMatrix();
  const dateCol = 0;
  const nameRow = 0;
  for (let col = 1; col < caseCount[0].length; col++) {
    const country = {cases: []};
    for (let row = 0; row < caseCount.length - 1; row++) {
      const date = caseCount[row][dateCol];
      let item = caseCount[row][col];
      if (row == nameRow) {
        country.name = item;
      } else {
        if (item === '') {
          item = 0;
        } else {
          item = parseInt(item);
        }
        country.cases.push({
          date: date,
          count: item,
        });
      }
    }
    json.push(country);
  }
  return json;
}

module.exports = {
  getJSON,
};

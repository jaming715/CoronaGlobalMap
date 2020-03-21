// const root = 'https://www.coronaglobalmap.com';
const root = 'http://localhost:3000';
const endpoint = root + '/country';
const red = '#F44336';

async function getData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log('Error fetching data.', err);
  }
}

function getJohnDataString(title, cases, deaths, recovered) {
  return `<strong>${title}</strong></br>
    Total Confirmed Cases: ${cases}</br>
    Total Deaths: ${deaths}</br>
    Total Recovered: ${recovered}`;
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getCountry(countries, name) {
  return countries.find(country => country.location === name);
}

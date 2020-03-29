const root = window.location.origin;
const endpoint = root + '/api/country';
const newsEndpoint = root + '/api/news';
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

// async function getCountryNews(countryCode, page) {
//   try {
//     let response = null;
//     if (countryCode === 'World') {
//       response = await axios.get(`${newsEndpoint}/everything/${page}`);
//     } else {
//       response = await axios.get(
//         `${newsEndpoint}/everything/${countryCode}/${page}`,
//       );
//     }
//     return response.data;
//   } catch (err) {
//     console.log('Error retrieving world news.', err);
//   }
// }

async function getNews() {
  try {
    let response = null;
    const url = document.location.href;
    let ending = url.slice(url.lastIndexOf('/'));
    ending = ending === '/PR' ? 'PR' : '';
    response = await axios.get(`${newsEndpoint}/${ending}`);
    return response.data;
  } catch (err) {
    console.log('Error retrieving world news.', err);
  }
}

async function getNewsFromSource(source) {
  try {
    let response = null;
    response = await axios.get(`${newsEndpoint}/${source}`);
    return response.data;
  } catch (err) {
    console.log('Error retrieving world news.', err);
  }
}

async function getSources() {
  try {
    let response = null;
    const url = document.location.href;
    let ending = url.slice(url.lastIndexOf('/'));
    ending = ending === '/PR' ? 'PR' : '';
    response = await axios.get(`${newsEndpoint}/sources/${ending}`);
    return response.data;
  } catch (err) {
    console.log('Error retrieving world news.', err);
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

function updateStats(region, totCases, totDeaths, totRecovered) {
  $('#region').html(region);
  $('#tot-cases').html(numWithCommas(totCases));
  $('#tot-deaths').html(numWithCommas(totDeaths));
  $('#tot-recovered').html(numWithCommas(totRecovered));
}

$('form').submit(() => {
  return false;
});

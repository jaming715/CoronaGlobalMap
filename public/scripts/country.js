// const root = 'http://www.coronaglobalmap.com';
const root = 'http://localhost:3000';
const johnHopEndpoint = root + '/api/johnHopData';

async function getData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log('Error fetching data.', err);
  }
}

function getCountry(countries, name) {
  return countries.find(country => country.location === name);
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getMapHtml(country) {
  return (
    country.map &&
    `<object id="${country.code}" type="image/svg+xml" data="${country.map}">
       Your browser doesn't support svg.
    </object>`
  );
}

function getPercent(fraction, tot) {
  const percent = (fraction / tot) * 100;
  return percent.toFixed(3);
}

function setUpProvinces(country) {
  const provinces = country.provinces;
  provinces.forEach((province, i) => {
    oddRow = i % 2 ? 'odd-row' : '';
    $('#provinces').append(
      `<tr class="${oddRow}">
        <td>${province.name}</td>
        <td>${province.totCases}</td>
        <td>${province.totDeaths}</td>
        <td>${province.totRecovered}</td>
      </tr>`,
    );
  });
}

async function setUpData(countryName) {
  const countries = await getData(johnHopEndpoint);
  const country = getCountry(countries, countryName);
  $('.pop > span').html(numWithCommas(country.population));
  $('.percent > span').html(
    `%${getPercent(country.totCases, country.population)}`,
  );
  const mapHtml = getMapHtml(country);
  $('.map').html(getMapHtml(country));
  $('object').css('visibility', 'hidden');
  $('object').on('load', () => {
    const svg = $('object')
      .contents()
      .find('svg');
    const width = svg.attr('width');
    const height = svg.attr('height');
    if (countryName !== 'United States') {
      svg.attr('width', '100%');
      svg.attr('height', '100%');
      svg.attr('viewBox', `0 0 ${width} ${height}`);
    }
    const stroke = $('.map').css('stroke');
    svg.children('path').css({
      fill: $('.map').css('fill'),
      stroke: $('.map').css('stroke'),
      strokeWidth: $('.map').css('stroke-width'),
    });
    $('object').css('visibility', 'visible');
  });
  setUpProvinces(country);
}

function getResults(searchRes) {
  searchRes.forEach((res, i) => {
    $('#search-res').append(
      `<a class="${first} ${last}" href=/${res.code}><li>${res.location}</li></a>`,
    );
  });
}

function conductSearch(query, data) {
  if (!query) {
    return;
  }
  const searchRes = data.filter(country => {
    countryName = country.location.toLowerCase();
    return countryName.includes(query) && country.code != '--';
  });
  getResults(searchRes);
  $('#res-label').css('display', 'block');
}

async function setUpSearch(provinces) {
  if (provinces) {
    $('#search').on('change paste keyup', e => {
      const query = e.target.value.toLowerCase();
      conductSearch(query, data);
    });
  }
}

setUpData($('#country').html());

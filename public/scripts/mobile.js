const root = 'http://www.coronaglobalmap.com';
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

function getResults(searchRes) {
  let html = '';
  searchRes.forEach((res, i) => {
    const first = i === 0 ? 'first' : '';
    const last = i === searchRes.length - 1 ? 'last' : '';
    html += `<li class="${first} ${last}"><a href=/${res.code}>${res.location}</a></li>`;
  });
  return html;
}

function conductSearch(query, data) {
  if (!query) {
    $('#search-res').html('');
    $('#res-label').css('display', 'none');
    return;
  }
  const searchRes = data.filter(country => {
    countryName = country.location.toLowerCase();
    return countryName.includes(query) && country.code != '--';
  });
  const resHtml = getResults(searchRes);
  $('#search-res').html(resHtml);
  $('#res-label').css('display', 'block');
}

async function setUpSearch() {
  const data = await getData(johnHopEndpoint);
  if (data) {
    $('.ref').append('Last updated: ' + data[0].date);
    $('#search').on('change paste keyup', e => {
      const query = e.target.value.toLowerCase();
      conductSearch(query, data);
    });
  } else {
    $('body').html("Sorry, couldn't retrieve data for Covid-19");
  }
}

setUpSearch();

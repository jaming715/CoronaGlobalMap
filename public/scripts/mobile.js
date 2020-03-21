function getResults(searchRes) {
  $('#search-res').empty();
  searchRes.forEach((res, i) => {
    const first = i === 0 ? 'first' : '';
    const last = i === searchRes.length - 1 ? 'last' : '';
    $('#search-res').append(
      `<a class="${first} ${last}" href=/${res.code}><li>${res.location}</li></a>`,
    );
  });
}

function conductSearch(query, data) {
  if (!query) {
    $('#search-res').empty();
    $('#res-label').css('display', 'none');
    return;
  }
  const searchRes = data.filter(country => {
    countryName = country.location.toLowerCase();
    return countryName.includes(query) && country.code != '--';
  });
  getResults(searchRes);
  $('#res-label').css('display', 'block');
}

async function setUpSearch() {
  const data = await getData(endpoint);
  const world = data.find(e => e.location === 'World');
  const worldHtml = getJohnDataString(
    world.location,
    world.totCases,
    world.totDeaths,
    world.totRecovered,
  );
  $('.world-stats').html(worldHtml);
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

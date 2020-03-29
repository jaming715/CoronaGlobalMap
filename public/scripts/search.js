function getResults(searchRes) {
  $('#search-res').empty();
  searchRes.forEach((res, i) => {
    const first = i === 0 ? 'first' : '';
    const last = i === searchRes.length - 1 ? 'last' : '';
    $('#search-res').append(
      `<a class="${first} ${last}" href=/country/${res.code}><li>${res.location}</li></a>`,
    );
  });
}

function conductSearch(query, data) {
  if (!query) {
    $('#search-res').empty();
    $('#search-res').css('display', 'none');
    $('#res-label').css('display', 'none');
    return;
  }
  $('#search-res').css('display', 'block');
  let searchRes = null;
  if (query === 'all') {
    searchRes = data;
  } else {
    searchRes = data.filter(country => {
      countryName = country.location.toLowerCase();
      return countryName.startsWith(query) && country.code != '--';
    });
  }
  getResults(searchRes);
  $('#res-label').css('display', 'block');
}

function listenForClicks(data) {
  $(document).mousedown(function(e) {
    const clicked = $(e.target);
    if (clicked.prop('tagName') === 'LI') {
      window.location = clicked.parent().attr('href');
    } else if (clicked.attr('id') === 'search') {
      const query = e.target.value.toLowerCase().replace(' ', '');
      if (!query) conductSearch('all', data);
    } else {
      conductSearch('', data);
    }
  });
}
async function setUpSearch() {
  const data = await getData(endpoint);
  const world = data.find(e => e.location === 'World');
  if (data) {
    // $('.ref').append('Last updated: ' + data[0].date);
    $('#search').on('change paste keyup', e => {
      const query = e.target.value.toLowerCase();
      conductSearch(query, data);
    });
    listenForClicks(data);
  } else {
    $('body').html("Sorry, couldn't retrieve data for Covid-19");
  }
  finishedLoading();
}

setUpSearch();
// setUpNews('US');

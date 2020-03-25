function showProvinceStats(province) {
  updateStats(
    province.name,
    province.totCases,
    province.totDeaths,
    province.totRecovered,
  );
}

function getSuggestions(query, counties) {
  if (query === 'none') return [];
  const suggestions = counties.filter(county => {
    const countyName = county.name.toLowerCase().replace(' ', '');
    return countyName.startsWith(query);
  });
  return suggestions;
}

function showSuggestions(query, counties) {
  const list = $('.auto-suggestions');
  const suggestions = getSuggestions(query, counties);
  list.empty();
  if (suggestions.length === 0) {
    list.css('display', 'none');
  } else {
    list.css('display', 'block');
  }
  suggestions.forEach(suggestion => {
    list.append(`<li>${suggestion.name}</li>`);
  });
  $('.auto-suggestions > li').on('mouseenter', function(e) {
    $('input')
      .val($(this).html())
      .trigger('change', true);
  });
  $('.auto-suggestions > li').on('click', function(e) {
    list.css('display', 'none');
    $('input')
      .val($(this).html())
      .trigger('change');
  });
}

function getCounty(query, counties) {
  const county = counties.find(county => {
    const countyName = county.name.toLowerCase().replace(' ', '');
    return query === countyName;
  });
  return county;
}

function setUpSearch(province, counties) {
  $('#search').on('change paste keyup', (e, hovered) => {
    const query = e.target.value.toLowerCase().replace(' ', '');
    const county = getCounty(query, counties);
    if (county) {
      if (!hovered) {
        list = $('.auto-suggestions');
        list.css('display', 'none');
      }
      updateStats(
        county.name,
        county.totCases,
        county.totDeaths,
        county.totRecovered,
      );
    } else {
      showProvinceStats(province);
      showSuggestions(query, counties);
    }
  });
  $('#search').on('click', e => {
    const query = e.target.value.toLowerCase().replace(' ', '');
    if (!query) showSuggestions('', counties);
  });
  $('#search').on('focusout', e => {
    showSuggestions('none', counties);
  });
}

async function setUpData(countryName, provName) {
  const countries = await getData(endpoint);
  $('.ref').append('Last updated: ' + countries[0].date);
  const country = getCountry(countries, countryName);
  const province = country.provinces.find(e => e.name === provName);
  setUpSearch(province, province.counties);
  $('#search-block').css('display', 'flex');
}

setUpData($('#country').html(), $('#region').html());

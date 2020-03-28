let activeProvince = null;
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

function showCountryStats(country) {
  updateStats(
    country.location,
    country.totCases,
    country.totDeaths,
    country.totRecovered,
  );
}

function showSearchRes(svg, country, province) {
  const stroke = $('.map').css('stroke');
  const prov = svg.find(`[name='${province.name}']`);
  activeProvince = prov;
  prov.css('fill', stroke);
  updateStats(
    province.name,
    province.totCases,
    province.totDeaths,
    province.totRecovered,
  );
}

function getSuggestions(query, provinces) {
  if (query === 'none') return [];
  const suggestions = provinces.filter(province => {
    const prov = province.name.toLowerCase().replace(' ', '');
    return prov.startsWith(query);
  });
  return suggestions;
}

function showSuggestions(query, provinces) {
  const list = $('.auto-suggestions');
  const suggestions = getSuggestions(query, provinces);
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
  $('.auto-suggestions > li').on('click, tap', function(e) {
    list.css('display', 'none');
    $('input')
      .val($(this).html())
      .trigger('change');
  });
}

function getProvince(query, provinces) {
  const province = provinces.find(province => {
    const prov = province.name.toLowerCase().replace(' ', '');
    return query === prov;
  });
  return province;
}

function setUpSearch(svg, country, provinces) {
  $('#search').on('change paste keyup', (e, hovered) => {
    const query = e.target.value.toLowerCase().replace(' ', '');
    const province = getProvince(query, provinces);
    if (!hovered) $('.auto-suggestions').css('display', 'none');
    if (activeProvince) {
      clearProvBack(activeProvince);
      activeProvince = null;
    }
    if (province) {
      showSearchRes(svg, country, province);
      if (province.code && province.counties.length > 0) {
        $('#county-search').css('display', 'block');
        $('#county-search').attr(
          'href',
          `/country/${country.code}/${province.code}/counties`,
        );
      } else {
        $('#county-search').css('display', 'none');
      }
    } else {
      $('#county-search').css('display', 'none');
      showCountryStats(country);
      showSuggestions(query, provinces);
    }
  });
  $('#search').on('click', e => {
    const query = e.target.value.toLowerCase().replace(' ', '');
    if (!query) showSuggestions('', provinces);
  });
  $('#search').on('focusout', e => {
    showSuggestions('none', provinces);
  });
}

function clearProvBack(province) {
  $(province).css('fill', $('.map').css('fill'));
}

function clearActiveProv(country) {
  if (activeProvince) clearProvBack(activeProvince);
  $('#county-search').css('display', 'none');
  activeProvince = null;
  $('input').val('');
  showCountryStats(country);
}

function provinceHoverHandler(province, country) {
  clearActiveProv(country);
  const stroke = $(province).css('stroke');
  $(province).css('fill', stroke);
}

function provinceClickHandler(svg, country, province) {
  if ($(province).attr('id') === $(activeProvince).attr('id')) {
    clearActiveProv(country);
    svg.children('path').each(function() {
      $(this).on('mouseenter', () => provinceHoverHandler(this, country));
      $(this).on('mouseout', () => clearProvBack(this));
    });
  } else {
    $('input')
      .val($(province).attr('name'))
      .trigger('change');
    svg.children('path').each(function() {
      $(this).off('mouseenter mouseout');
    });
    activeProvince = province;
  }
}

function addMapListeners(svg, country) {
  svg.children('path').each(function() {
    $(this).on('mouseenter', () => provinceHoverHandler(this, country));
    $(this).on('mouseout', () => clearProvBack(this));
    $(this).on('click', () => provinceClickHandler(svg, country, this));
  });
}

function addMapStyling(svg, countryName, provinces) {
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
}

function addDataToSVG(svg, provinces) {
  let provFound = false;
  provinces.forEach(province => {
    const element = svg.find(`path[name='${province.name}']`);
    if (element.attr('name')) {
      provFound = true;
      element.attr('tot-cases', province.totCases);
      element.attr('tot-deaths', province.totDeaths);
      element.attr('tot-recovered', province.totRecovered);
      element.css('cursor', 'pointer');
    }
  });
  return provFound;
}

async function setUpData(countryName) {
  const countries = await getData(endpoint);
  $('.ref').append('Last updated: ' + countries[0].date);
  const country = getCountry(countries, countryName);
  const provinces = country.provinces;
  const mapHtml = getMapHtml(country);
  $('.map').html(getMapHtml(country));
  $('object').on('load', () => {
    const svg = $('object')
      .contents()
      .find('svg');
    addMapStyling(svg, countryName, provinces);
    if (addDataToSVG(svg, provinces)) {
      addMapListeners(svg, country);
      setUpSearch(svg, country, provinces);
    }
  });
  finishedLoading();
}

setUpData($('#country').html());

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
    numWithCommas(country.totCases),
    numWithCommas(country.totDeaths),
    numWithCommas(country.totRecovered),
  );
}

function showSearchRes(svg, country, province) {
  const fill = $('.map').css('fill');
  const stroke = $('.map').css('stroke');
  const prov = svg.find(`[name='${province.name}']`);
  activeProvince = prov;
  prov.css('fill', stroke);
  updateStats(
    province.name,
    numWithCommas(province.totCases),
    numWithCommas(province.totDeaths),
    numWithCommas(province.totRecovered),
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
function clearActiveProv() {
  activeProvince.css('fill', $('.map').css('fill'));
}
function setUpSearch(svg, country, provinces) {
  $('#search').on('change paste keyup', (e, hovered) => {
    const query = e.target.value.toLowerCase().replace(' ', '');
    const province = getProvince(query, provinces);
    if (!hovered) $('.auto-suggestions').css('display', 'none');
    if (activeProvince) clearActiveProv();
    if (province) {
      showSearchRes(svg, country, province);
      if (province.code && province.counties.length > 0) {
        $('#county-search').css('display', 'block');
        $('#county-search').attr('href', `/${country.code}/${province.code}`);
      } else {
        $('#county-search').css('display', 'none');
      }
    } else {
      $('#county-search').css('display', 'none');
      activeProvince = null;
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

function addMapListeners(svg, country) {
  svg.children('path').each(function() {
    const totCases = $(this).attr('tot-cases');
    const totDeaths = $(this).attr('tot-deaths');
    const totRecovered = $(this).attr('tot-recovered');
    // if (totCases) $(this).css('fill', red);
    const fill = $(this).css('fill');
    const stroke = $(this).css('stroke');
    const infoBack = $(this).css('background');
    $(this).on('mouseenter', () => {
      $(this).css('fill', stroke);
      if (activeProvince) clearActiveProv();
      activeProvince = $(this);
      if (totCases) {
        $('input')
          .val($(this).attr('name'))
          .trigger('change');
      } else {
        $('input')
          .val('No Data')
          .trigger('change');
      }
    });
    // $(this).on('mouseout', () => {
    //   $(this).css('fill', fill);
    //   $(this).css('stroke', stroke);
    //   $('input')
    //     .val('')
    //     .trigger('change');
    // });
  });
}

function setUpShowCountryStats() {
  $('.show-country').on('click', () => {
    if (activeProvince) clearActiveProv();
    $('input')
      .val('')
      .trigger('change');
    $('.auto-suggestions').css('display', 'none');
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
  $('object').css('visibility', 'hidden');
  $('object').on('load', () => {
    const svg = $('object')
      .contents()
      .find('svg');
    addMapStyling(svg, countryName, provinces);
    $('object').css('visibility', 'visible');
    if (addDataToSVG(svg, provinces)) {
      $('#hover').css('display', 'block');
      $('input').css('display', 'block');
      addMapListeners(svg, country);
      setUpSearch(svg, country, provinces);
      setUpShowCountryStats();
    }
  });
}

setUpData($('#country').html());

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

function updateStats(region, totCases, totDeaths, totRecovered) {
  $('#region').html(region);
  $('#tot-cases').html(totCases);
  $('#tot-deaths').html(totDeaths);
  $('#tot-recovered').html(totRecovered);
}

function getMapRes(query, svg, country, provinces) {
  const fill = $('.map').css('fill');
  const stroke = $('.map').css('stroke');
  svg.children('path').each(function() {
    let name = $(this).attr('name');
    const province = provinces.find(e => e.name === name);
    name = name.toLowerCase().replace(' ', '');
    if (name === query) {
      $(this).css('fill', stroke);
      updateStats(
        province.name,
        numWithCommas(province.totCases),
        numWithCommas(province.totDeaths),
        numWithCommas(province.totRecovered),
      );
    } else if (query === 'No Data') {
      $(this).css('fill', fill);
      updateStats(
        'No Data Available',
        numWithCommas('N/A'),
        numWithCommas('N/A'),
        numWithCommas('N/A'),
      );
    } else if (query === '') {
      $(this).css('fill', fill);
      updateStats(
        country.location,
        numWithCommas(country.totCases),
        numWithCommas(country.totDeaths),
        numWithCommas(country.totRecovered),
      );
    }
  });
}

function setUpSearch(svg, country, provinces) {
  $('#search').on('change paste keyup', e => {
    const query = e.target.value.toLowerCase().replace(' ', '');
    getMapRes(query, svg, country, provinces);
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
    $(this).on('mouseover tap', () => {
      $(this).css('fill', stroke);
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
    $(this).on('mouseout', () => {
      $(this).css('fill', fill);
      $(this).css('stroke', stroke);
      $('input')
        .val('')
        .trigger('change');
    });
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
  const country = getCountry(countries, countryName);
  const provinces = country.provinces;
  const mapHtml = getMapHtml(country);
  $('.map').html(getMapHtml(country));
  $('object').css('visibility', 'hidden');
  $('object').on('load', () => {
    const svg = $('object')
      .contents()
      .find('svg');
    if (provinces.length > 0) setUpSearch(svg, country, provinces);
    addMapStyling(svg, countryName, provinces);
    $('object').css('visibility', 'visible');
    if (addDataToSVG(svg, provinces)) {
      $('input').css('display', 'inline-block');
      addMapListeners(svg, country);
    }
  });
}

setUpData($('#country').html());

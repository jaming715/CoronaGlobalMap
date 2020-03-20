let countryFill = '#1c2833';
let countryStroke = '#82e0aa';
let countryFillHover = '#1c2833';
const whoEndpoint = root + '/api/whoData';
const triggerWho = false;

function getWhoDataString(country) {
  const data = country.data;
  const name = country.location;
  const dataToday = data[data.length - 1];
  return `<strong>${name}</strong></br>
    New Cases: ${dataToday.newCases}</br>
    New Deaths: ${dataToday.newDeaths}</br>
    Total Cases: ${dataToday.totCases}</br>
    Total Deaths: ${dataToday.totDeaths}`;
}

function getNotFound() {
  return getJohnDataString('No Data Available', 'N/A', 'N/A', 'N/A');
}

function getLoading() {
  return getJohnDataString(
    'Loading...',
    'Loading...',
    'Loading...',
    'Loading...',
  );
}

function getDataString(country, whoData) {
  if (whoData) {
    return getWhoDataString(country);
  } else {
    return getJohnDataString(
      `Covid-19 Status: ${country.location}`,
      country.totCases,
      country.totDeaths,
      country.totRecovered,
    );
  }
}

function getEndpoint(whoData) {
  if (whoData) {
    return whoEndpoint;
  } else {
    return johnHopEndpoint;
  }
}

async function addDataToSVG(svg) {
  const data = await getData(getEndpoint(triggerWho));
  if (data) $('.ref').append('Last updated: ' + data[0].date);
  data.forEach(country => {
    const element = svg.find(`#${country.code}`);
    // element.css('fill', getCountryFill(country.totCases, country.pop));
    if (element.attr('id')) {
      const data = getDataString(country, triggerWho);
      element.attr('data-info', data);
      element.css('cursor', 'pointer');
      element.on('click taphold', () => {
        window.location = `${root}/${country.code}`;
      });
    }
  });
  return data;
}

function addMapListeners(svg, worldDataStr) {
  svg.children().each(function() {
    const fill = $(this).css('fill');
    const stroke = $(this).css('stroke');
    const infoBack = $(this).css('background');
    const countryData = $(this).attr('data-info');
    $(this).on('mouseover tap', () => {
      $(this).css('fill', stroke);
      if (countryData) {
        $('#info-box').html(countryData);
      } else {
        $('#info-box').html(getNotFound());
      }
    });
    $(this).on('mouseout', () => {
      $(this).css('fill', fill);
      $(this).css('stroke', stroke);
      $('#info-box').html(worldDataStr);
    });
  });
}

$('#info-box').html(getLoading());
$(window).on('load', async () => {
  let svg = $('object')
    .contents()
    .find('svg');
  const data = await addDataToSVG(svg);
  const worldData = data.find(e => e.location == 'World');
  const worldDataStr = getDataString(worldData, triggerWho);
  $('#info-box').html(worldDataStr);
  $('#info-box').css('display', 'inline-block');
  addMapListeners(svg, worldDataStr);
});

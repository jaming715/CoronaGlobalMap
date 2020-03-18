let countryFill = '#1c2833';
let countryStroke = '#82e0aa';
let countryFillHover = '#1c2833';
const root = 'https://coronaglobalmap.com';
// const root = 'http://localhost:3000';
const whoEndpoint = root + '/api/whoData';
const johnHopEndpoint = root + '/api/johnHopData';
const triggerWho = false;

async function getData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log('Error fetching data.', err);
  }
}

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

function getJohnDataString(country) {
  const name = country.location;
  return `<strong>Covid-19 Status: ${name}</strong></br>
    Total Cases: ${country.totCases}</br>
    Total Deaths: ${country.totDeaths}</br>
    Total Recovered: ${country.totRecovered}`;
}

function getNotFound() {
  return `<strong>No Data Available</strong></br>
    Total Cases: N/A</br>
    Total Deaths: N/A</br>
    Total Recovered: N/A`;
}

function getLoading() {
  return `<strong>Loading...</strong></br>
    Total Cases: Loading...</br>
    Total Deaths: Loading...</br>
    Total Recovered: Loading...`;
}

function getDataString(country, whoData) {
  if (whoData) {
    return getWhoDataString(country);
  } else {
    return getJohnDataString(country);
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
      element.on('click', () => {
        window.location = `${root}/${country.code}`;
      });
    }
  });
  return data;
}

$(window).on('load', async () => {
  let svg = $('object')
    .contents()
    .find('svg');
  $('#info-box').html(getLoading());
  const data = await addDataToSVG(svg);
  const worldData = data.find(e => e.location == 'World');
  const worldDataStr = getDataString(worldData, triggerWho);
  $('#info-box').html(worldDataStr);
  $('#info-box').css('display', 'inline-block');
  svg.children().each(function() {
    const fill = $(this).css('fill');
    const stroke = $(this).css('stroke');
    const infoBack = $(this).css('background');
    const countryData = $(this).attr('data-info');
    $(this).on('mouseover', () => {
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
});

let countryFill = '#1c2833';
let countryStroke = '#82e0aa';
let countryFillHover = '#1c2833';
const whoEndpoint = 'http://localhost:8000/api/whoData';
const johnHopEndpoint = 'http://localhost:8000/api/johnHopData';
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
  return `<strong>${name}</strong></br>
    Total Cases: ${country.totCases}</br>
    Total Deaths: ${country.totDeaths}</br>
    Total Recovered: ${country.totRecovered}`;
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
  data.forEach(country => {
    const element = svg.find(`#${country.code}`);
    // element.css('fill', getCountryFill(country.totCases, country.pop));
    if (element.attr('id')) {
      const data = getDataString(country, triggerWho);
      element.attr('data-info', data);
      element.css('cursor', 'pointer');
      element.on('click', () => {
        window.location = `http://localhost:3000/${country.code}`;
      });
      // element.attr(
      //   'hover-color',
      //   getCountryFill(country.totCases, country.pop),
      // );
    }
  });
}

$(window).on('load', async () => {
  let svg = $('object')
    .contents()
    .find('svg');
  // get colors from css
  await addDataToSVG(svg);
  svg.children().each(function() {
    const fill = $(this).css('fill');
    const stroke = $(this).css('stroke');
    const infoBack = $(this).css('background');
    const countryData = $(this).attr('data-info');
    // const hoverFill = $(this).attr('hover-color');
    $(this).on('mouseover', () => {
      $(this).css('fill', stroke);
      $('#info-box').css('display', 'block');
      if (countryData) {
        $('#info-box').html(countryData);
        // $('#info-box').css('background', hoverFill);
      } else {
        $('#info-box').html('No data');
      }
    });
    $(this).on('mouseout', () => {
      $(this).css('fill', fill);
      $(this).css('stroke', stroke);
      $('#info-box').css('display', 'none');
    });
  });
  svg.mousemove(e => {
    let infoBox = $('#info-box');
    infoBox.css('top', e.pageY - infoBox.height());
    infoBox.css('left', e.pageX - infoBox.width());
  });
});

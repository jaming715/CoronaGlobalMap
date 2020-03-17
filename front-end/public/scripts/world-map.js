const countryFill = '#17202a';
const countryStroke = '#82e0aa';
const countryFillHover = '#82e0aa';

const dataEndpoint = 'http://localhost:8000/api/allData';

async function getData() {
  try {
    const response = await axios.get('http://localhost:8000/api/allData');
    return response.data;
  } catch (err) {
    console.log('Error fetching data.', err);
  }
}

function getCountryDataString(country) {
  const data = country.data;
  const name = country.location;
  const dataToday = data[data.length - 1];
  return `<strong>${name}</strong></br> New Cases: ${dataToday.newCases}</br>New Deaths: ${dataToday.newDeaths}</br>Total Cases: ${dataToday.totCases}</br>Total Deaths: ${dataToday.totDeaths}`;
}

async function addDataToSVG(svg) {
  const data = await getData();
  data.forEach(country => {
    const element = svg.find(`#${country.code}`);
    if (element.attr('id')) {
      const data = getCountryDataString(country);
      element.attr('data-info', data);
    }
  });
}

$(window).on('load', async () => {
  let svg = $('object')
    .contents()
    .find('svg');
  await addDataToSVG(svg);
  svg.children().each(function() {
    const countryData = $(this).attr('data-info');
    $(this).on('mouseover', () => {
      $(this).css('fill', countryFillHover);
      $('#info-box').css('display', 'block');
      if (countryData) {
        $('#info-box').html(countryData);
      } else {
        $('#info-box').html('No data');
      }
    });
    $(this).on('mouseout', () => {
      $(this).css('fill', countryFill);
      $('#info-box').css('display', 'none');
    });
  });
  svg.mousemove(e => {
    let infoBox = $('#info-box');
    infoBox.css('top', e.pageY - infoBox.height());
    infoBox.css('left', e.pageX - infoBox.width());
  });
});

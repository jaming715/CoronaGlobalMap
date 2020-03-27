let countryFill = '#1c2833';
let countryStroke = '#82e0aa';
let countryFillHover = '#1c2833';

async function addDataToSVG(svg) {
  const data = await getData(endpoint);
  if (data) $('.ref').append('Last updated: ' + data[0].date);
  data.forEach(country => {
    const element = svg.find(`#${country.code}`);
    if (element.attr('id')) {
      element.attr('location', country.location);
      element.attr('tot-cases', country.totCases);
      element.attr('tot-deaths', country.totDeaths);
      element.attr('tot-recovered', country.totRecovered);
      element.css('cursor', 'pointer');
      element.on('click taphold', () => {
        window.location = `/country/${country.code}`;
      });
    }
  });
  return data;
}

function addMapListeners(svg, world) {
  svg.children().each(function() {
    const fill = $(this).css('fill');
    const stroke = $(this).css('stroke');
    const infoBack = $(this).css('background');
    const name = $(this).attr('location');
    const totCases = $(this).attr('tot-cases');
    const totDeaths = $(this).attr('tot-deaths');
    const totRecovered = $(this).attr('tot-recovered');
    $(this).on('mouseover tap', () => {
      $(this).css('fill', stroke);
      if (name) {
        updateStats(name, totCases, totDeaths, totRecovered);
      } else {
        updateStats('Not found', 'N/A', 'N/A', 'N/A');
      }
    });
    $(this).on('mouseout', () => {
      $(this).css('fill', fill);
      $(this).css('stroke', stroke);
      updateStats(
        world.location,
        world.totCases,
        world.totDeaths,
        world.totRecovered,
      );
    });
  });
}

$(window).on('load', async () => {
  let svg = $('object')
    .contents()
    .find('svg');
  const data = await addDataToSVG(svg);
  const world = data.find(e => e.location == 'World');
  addMapListeners(svg, world);
  finishedLoading();
});

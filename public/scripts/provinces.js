function getResults(searchRes) {
  $('tr').each(function() {
    const province = $(this)
      .find('>:first-child')
      .html();
    if (province === 'Province') return;
    const found = searchRes.find(res => {
      return res.name === province;
    });
    if (found) {
      $(this).css('display', '');
    } else {
      $(this).css('display', 'none');
    }
  });
}

function conductSearch(query, provinces) {
  const searchRes = provinces.filter(province => {
    province = province.name.toLowerCase();
    return province.includes(query);
  });
  getResults(searchRes);
  $('#res-label').css('display', 'block');
}

function setUpSearch(provinces) {
  $('#search').on('change paste keyup', e => {
    const query = e.target.value.toLowerCase().replace(' ', '');
    conductSearch(query, provinces);
  });
}

async function setUpData(countryName) {
  const countries = await getData(endpoint);
  const country = getCountry(countries, countryName);
  setUpSearch(country.provinces);
  $('#search-block').css('display', 'flex');
}

setUpData($('#country').html());

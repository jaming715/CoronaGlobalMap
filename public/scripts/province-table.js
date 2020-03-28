function getResults(searchRes) {
  let count = 0;
  $('tr').each(function() {
    const province = $(this)
      .find('>:first-child')
      .html();
    if (province === 'Province' || province === 'State') return;
    const found = searchRes.find(res => {
      return res.name === province;
    });
    if (found) {
      const odd = count % 2 !== 0 ? 'odd-row' : '';
      $(this).css('display', '');
      $(this).attr('class', odd);
      count++;
    } else {
      $(this).css('display', 'none');
    }
  });
}

function conductSearch(query, provinces) {
  const searchRes = provinces.filter(province => {
    province = province.name.toLowerCase().replace(' ', '');
    return province.startsWith(query);
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
  finishedLoading();
}

setUpData($('#country').html());

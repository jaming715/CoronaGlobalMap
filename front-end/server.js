const express = require('express');
const path = require('path');
const axios = require('axios');
const johnHopEndpoint = 'http://localhost:8000/api/johnHopData';

async function getData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    // console.log(response);
    return response.data;
  } catch (err) {
    console.log('Error fetching data.', err);
  }
}
const app = express();
const port = process.env.PORT || '3000';
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

async function setup() {
  try {
    const countries = await getData(johnHopEndpoint);
    if (countries) {
      countries.forEach(country => {
        if (country.code != '--') {
          app.get(`/${country.code}`, function(req, res) {
            res.render('country', {
              name: country.location,
              totCases: country.totCases,
              totDeaths: country.totDeaths,
              totRecovered: country.totRecovered,
            });
          });
        }
      });
    }
  } catch (err) {
    console.log('Error retrieving countries', err);
  }

  app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });
}
setup();

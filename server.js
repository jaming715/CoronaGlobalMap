const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const schedule = require('node-schedule');
const compression = require('compression');
const helmet = require('helmet');
const caseBot = require('./data-bots/case-bot.js');
const allDataBot = require('./data-bots/all-data-bot.js');
const johnBot = require('./data-bots/john-bot.js');
const helper = require('./data-bots/helper-bot.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const countryRouter = require('./routes/country-router.js');
const {updateCountries} = require('./db-bots/country-manager.js');

dotenv.config();
const app = express();
const apiUrl = '/api';
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.json());

const uri = process.env.MONGO_CONNECT_STR;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/country', countryRouter);

// app.get(apiUrl + '/caseCounts', async (req, res) => {
//   const cases = await caseBot.getJSON();
//   res.send(cases);
// });

// app.get(apiUrl + '/whoData', async (req, res) => {
//   const data = await allDataBot.getJSON();
//   console.log(data.length);
//   res.send(data);
// });

// app.get(apiUrl + '/johnHopData', async (req, res) => {
//   // res.sendFile(path.join(__dirname, './data/john-data.json'));
//   const data = await johnBot.getJSON();
//   res.send(data);
// });

function makeProvincesPage(country) {
  app.get(`/${country.code}/provinces`, function(req, res) {
    res.render('provinces', {
      title: `Covid-19 ${country.location}`,
      name: country.location,
      code: country.code,
      provinces: country.provinces,
    });
  });
}

function makeCountryPage(country) {
  if (country.code != '--') {
    app.get(`/${country.code}`, function(req, res) {
      res.render('country', {
        title: `Covid-19 ${country.location}`,
        name: country.location,
        code: country.code,
        totCases: country.totCases,
        totDeaths: country.totDeaths,
        totRecovered: country.totRecovered,
        population: country.population,
        provinces: country.provinces,
      });
    });
  }
}

async function setUpCountries() {
  try {
    const countries = await johnBot.getJSON();
    if (countries) {
      countries.forEach(country => {
        makeCountryPage(country);
        const provinces = country.provinces;
        if (provinces && provinces.length > 0) makeProvincesPage(country);
      });
    }
  } catch (err) {
    console.log('Error retrieving countries', err);
  }
}

async function setup() {
  await setUpCountries();
  app.listen(port, () => {
    console.log(`Listening to requests on port: ${port}`);
  });
}
setup();
const job = schedule.scheduleJob('0 * * * *', function() {
  updateCountries();
});

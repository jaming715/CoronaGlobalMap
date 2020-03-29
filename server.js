const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const schedule = require('node-schedule');
const compression = require('compression');
const helmet = require('helmet');
const johnBot = require('./data-bots/john-bot.js');
const helper = require('./data-bots/helper-bot.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const countryApiRouter = require('./routes/api/api-country.js');
const newsApiRouter = require('./routes/api/api-news.js');
const countryPagesRouter = require('./routes/pages/pages-country.js');
const newsPagesRouter = require('./routes/pages/pages-news.js');
const Country = require('./models/country-model.js');
const {updateCountries} = require('./db-bots/country-manager.js');
const {newsRefresh} = require('./db-bots/news-manager.js');
const {prNewsRefresh} = require('./db-bots/pr-news-manager.js');

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

app.use('/api/country', countryApiRouter);
app.use('/api/news', newsApiRouter);
app.use('/country', countryPagesRouter);
app.use('/news', newsPagesRouter);

app.get('/', async (req, res) => {
  const world = await Country.findOne({location: 'World'});
  res.render('main', {
    title: 'Coronavirus Global Map',
    totCases: world.totCases,
    totDeaths: world.totDeaths,
    totRecovered: world.totRecovered,
  });
});

app.get('/search', async (req, res) => {
  const world = await Country.findOne({location: 'World'});
  res.render('search', {
    title: 'Coronavirus Global Map',
    totCases: world.totCases,
    totDeaths: world.totDeaths,
    totRecovered: world.totRecovered,
  });
});

const CountryUpdateJob = schedule.scheduleJob('0 * * * *', function() {
  updateCountries();
});

const NewsRefreshJob = schedule.scheduleJob('*/15 * * * *', function() {
  newsRefresh();
  prNewsRefresh();
});

app.listen(port, () => {
  console.log(`Listening to requests on port: ${port}`);
});

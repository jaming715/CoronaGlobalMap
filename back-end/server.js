const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const caseBot = require('./data-bots/case-bot.js');
const allDataBot = require('./data-bots/all-data-bot.js');

const port = 8000;

const app = express();
const baseUrl = '/api';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(baseUrl + '/caseCounts', async (req, res) => {
  const cases = await caseBot.getJSON();
  res.send(cases);
});

app.use(baseUrl + '/allData', async (req, res) => {
  const allData = await allDataBot.getJSON();
  console.log(allData.length);
  res.send(allData);
});

app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});

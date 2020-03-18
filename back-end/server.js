const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const schedule = require('node-schedule');
const caseBot = require('./data-bots/case-bot.js');
const allDataBot = require('./data-bots/all-data-bot.js');
const johnBot = require('./data-bots/john-bot.js');

const johnUpdateJob = schedule.scheduleJob('0 0 */1 * * *', async function() {
  await johnBot.getJSON();
});

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

app.use(baseUrl + '/whoData', async (req, res) => {
  const data = await allDataBot.getJSON();
  console.log(data.length);
  res.send(data);
});

app.use(baseUrl + '/johnHopData', async (req, res) => {
  res.sendFile(path.join(__dirname, './data/john-data.json'));
});

app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});

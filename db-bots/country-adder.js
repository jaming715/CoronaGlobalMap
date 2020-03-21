const mongoose = require('mongoose');
const Country = require('../models/country-model.js');
const johnBot = require('../data-bots/john-bot.js');
const dotenv = require('dotenv');

dotenv.config();
const uri = process.env.MONGO_CONNECT_STR;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function addCountriesToDB() {
  countries = await johnBot.getJSON();
  try {
    countries.forEach(async country => {
      const doc = await Country.create(country);
    });
  } catch (err) {
    console.log('', err);
  }
}

addCountriesToDB();

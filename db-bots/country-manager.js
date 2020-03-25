const mongoose = require('mongoose');
const Country = require('../models/country-model.js');
const johnBot = require('../data-bots/john-bot.js');
const dotenv = require('dotenv');

// dotenv.config();
// const uri = process.env.MONGO_CONNECT_STR;
// mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function addCountries() {
  countries = await johnBot.getJSON();
  try {
    countries.forEach(async country => {
      const doc = await Country.create(country);
    });
  } catch (err) {
    console.log('', err);
  }
}

async function updateCountries() {
  countries = await johnBot.getJSON();
  countries.forEach(async country => {
    try {
      const query = {location: country.location};
      const updated = await Country.updateOne(query, country);
    } catch (err) {
      console.log('', err);
    }
  });
}
updateCountries();
module.exports = {
  addCountries,
  updateCountries,
};

const mongoose = require('mongoose');
const Country = require('../models/country-model.js');
const johnBot = require('../data-bots/john-bot.js');

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
module.exports = {
  addCountries,
  updateCountries,
};

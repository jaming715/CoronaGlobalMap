const mongoose = require('mongoose');
const Country = require('../models/country-model.js');
const News = require('../models/news-model.js');

async function addNews() {
  const countries = await Country.find();
  countries.forEach(async country => {
    // const news = await getCountryNews(country.code, 1);
  });
}

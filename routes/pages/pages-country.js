const express = require('express');
const router = express.Router();
const Country = require('../../models/country-model.js');

router.get('/:id', async (req, res) => {
  const countryCode = req.params.id;
  const country = await Country.findOne({code: countryCode});
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

router.get(`/:id/province-table`, async function(req, res) {
  const countryCode = req.params.id;
  const country = await Country.findOne({code: countryCode});
  res.render('province-table', {
    title: `Covid-19 ${country.location}`,
    name: country.location,
    code: country.code,
    provinces: country.provinces,
  });
});

router.get(`/:countryId/:provId/counties`, async function(req, res) {
  const countryCode = req.params.countryId;
  const provCode = req.params.provId;
  const country = await Country.findOne({code: countryCode});
  const province = country.provinces.find(e => e.code === provCode);
  res.render('county', {
    title: `Covid-19 ${country.location}`,
    name: country.location,
    provName: province.name,
    counties: province.counties,
    totCases: province.totCases,
    totDeaths: province.totDeaths,
    totRecovered: province.totRecovered,
  });
});

module.exports = router;

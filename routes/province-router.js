const express = require('express');
const router = express.Router();
const {Province} = require('../models/province-model.js');

router.get('/', async (req, res) => {
  try {
    const provinces = await Province.find();
    res.send(provinces);
  } catch (err) {
    console.log('Error retrieving categories', err);
  }
});

router.post('/', async (req, res) => {
  const province = req.body;
  try {
    const doc = await Country.create({
      name: province.name,
      totCases: province.totCases,
      totDeaths: province.totDeaths,
      totRecovered: province.totRecovered,
    });
    res.send(doc);
  } catch (err) {
    console.log('Error adding country.', err);
  }
});

module.exports = router;

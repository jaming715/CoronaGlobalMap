const express = require('express');
const router = express.Router();
const Country = require('../../models/country-model.js');

router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.send(countries);
  } catch (err) {
    console.log('Error retrieving categories', err);
  }
});

// router.delete('/', async (req, res) => {
//   try {
//     const countries = await Country.deleteMany({});
//     res.send(countries);
//   } catch (err) {
//     console.log('Error retrieving categories', err);
//   }
// });

// router.post('/', async (req, res) => {
//   const country = req.body;
//   try {
//     const doc = await Country.create({
//       location: country.location,
//       date: country.date,
//       totCases: country.totCases,
//       totDeaths: country.totDeaths,
//       totRecovered: country.totRecovered,
//       population: country.population,
//       code: country.code,
//       map: country.map,
//       provinces: country.provinces,
//     });
//     res.send(doc);
//   } catch (err) {
//     console.log('Error adding country.', err);
//   }
// });
module.exports = router;

const express = require('express');
const router = express.Router();
const Country = require('../../models/country-model.js');

// router.get('/:id', async (req, res) => {
//   const countryCode = req.params.id;
//   const country = await Country.findOne({code: countryCode});
//   res.render('country-news', {
//     name: country.location,
//   });
// });

router.get('/PR', async (req, res) => {
  res.render('news', {
    title: 'Noticias Covid-19 Puerto Rico',
  });
});

router.get('/', async (req, res) => {
  res.render('news', {
    title: 'Covid-19 Daily Headlines',
  });
});

module.exports = router;

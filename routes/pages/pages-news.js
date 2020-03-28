const express = require('express');
const router = express.Router();
const Country = require('../../models/country-model.js');

router.get('/:id', async (req, res) => {
  const countryCode = req.params.id;
  const country = await Country.findOne({code: countryCode});
  res.render('country-news', {
    name: country.location,
  });
});

module.exports = router;

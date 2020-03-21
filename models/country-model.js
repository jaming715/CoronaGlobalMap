const mongoose = require('mongoose');
const {ProvinceSchema} = require('./province-model.js');
const Schema = mongoose.Schema;

const CountrySchema = new Schema(
  {
    location: String,
    date: String,
    totCases: Number,
    totDeaths: Number,
    totRecovered: Number,
    population: Number,
    code: String,
    map: String,
    provinces: [ProvinceSchema],
  },
  {
    timestamps: true,
    collection: 'Country',
  },
);
const Country = mongoose.model('Country', CountrySchema);
module.exports = Country;

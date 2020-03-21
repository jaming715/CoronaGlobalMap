const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvinceSchema = new Schema(
  {
    name: String,
    totCases: Number,
    totDeaths: Number,
    totRecovered: Number,
    country: {type: mongoose.Schema.Types.ObjectId, ref: 'Country'},
  },
  {
    timestamps: true,
    collection: 'Province',
  },
);
const Province = mongoose.model('Province', ProvinceSchema);
module.exports = {
  Province,
  ProvinceSchema,
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountySchema = new Schema(
  {
    name: String,
    totCases: Number,
    totDeaths: Number,
    totRecovered: Number,
    province: {type: mongoose.Schema.Types.ObjectId, ref: 'Province'},
  },
  {
    timestamps: true,
    collection: 'County',
  },
);
const County = mongoose.model('County', CountySchema);
module.exports = {
  County,
  CountySchema,
};

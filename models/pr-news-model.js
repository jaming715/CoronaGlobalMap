const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrNewsSchema = new Schema(
  {
    author: String,
    title: String,
    source: String,
    link: String,
    pubDate: String,
    contentSummary: String,
    version: String,
  },
  {
    timestamps: true,
    collection: 'PrNews',
  },
);
const PrNews = mongoose.model('PrNews', PrNewsSchema);
module.exports = PrNews;

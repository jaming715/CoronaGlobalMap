const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
  {
    source: {
      id: String,
      name: String,
    },
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    content: String,
    countryCode: String,
  },
  {
    timestamps: true,
    collection: 'News',
  },
);
const News = mongoose.model('News', NewsSchema);
module.exports = News;

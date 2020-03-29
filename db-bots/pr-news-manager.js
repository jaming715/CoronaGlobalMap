const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PrNews = require('../models/pr-news-model.js');
const rssBot = require('../data-bots/rss/rss-bot.js');

// dotenv.config();
// const uri = process.env.MONGO_CONNECT_STR;
// mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function addPrNews() {
  const newsArticles = await rssBot.getPrStoryFeeds();
  try {
    newsArticles.forEach(async article => {
      article.contentSummary = article.contentSnippet;
      if (article.creator) article.author = article.creator;
      article.pubDate = article.isoDate;
      article.version = 'latest';
      if (article.source === 'Primera Hora')
        article.link = 'https://www.primerahora.com/';
      if (article.source === 'Metro Puerto Rico')
        article.link = 'https://www.metro.pr/pr/';
      const doc = new PrNews(article);
      await doc.save();
    });
  } catch (err) {
    console.log('Error adding news story to DB', err);
  }
}

async function prNewsRefresh() {
  const newsArticles = await rssBot.getPrStoryFeeds();
  try {
    const updated = await PrNews.updateMany({}, {version: 'old'});
    await addPrNews();
    const deleted = await PrNews.deleteMany({version: 'old'});
  } catch (err) {
    console.log('Error updating news articles', err);
  }
}

async function deleteAllPrNews() {
  try {
    await PrNews.deleteMany({});
  } catch (err) {
    console.log('Error deleting news', err);
  }
}

// addPrNews();
// prNewsRefresh();
// deleteAllPrNews();

module.exports = {
  prNewsRefresh,
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Country = require('../models/country-model.js');
const News = require('../models/news-model.js');
const rssBot = require('../data-bots/rss/rss-bot.js');

// dotenv.config();
// const uri = process.env.MONGO_CONNECT_STR;
// mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function addNews() {
  const newsArticles = await rssBot.getTopStoryFeeds();
  try {
    const titles = [];
    newsArticles.forEach(async article => {
      article.contentSummary = article.contentSnippet;
      if (!titles.includes(article.title)) {
        titles.push(article.title);
        if (article.creator) article.author = article.creator;
        if (article.isoDate) {
          article.pubDate = article.isoDate;
        } else {
          article.pubDate = '--';
        }
        article.version = 'latest';
        const doc = new News(article);
        await doc.save();
      }
    });
  } catch (err) {
    console.log('Error adding news story to DB', err);
  }
}

async function newsRefresh() {
  const newsArticles = await rssBot.getTopStoryFeeds();
  try {
    const updated = await News.updateMany({}, {version: 'old'});
    await addNews();
    const deleted = await News.deleteMany({version: 'old'});
  } catch (err) {
    console.log('Error updating news articles', err);
  }
}

async function deleteAllNews() {
  try {
    await News.deleteMany({});
  } catch (err) {
    console.log('Error deleting news', err);
  }
}

// addNews();
// newsRefresh();
// deleteAllNews();

module.exports = {
  newsRefresh,
};

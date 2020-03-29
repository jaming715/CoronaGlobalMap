const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const NewsApi = require('newsapi');
const newsapi = new NewsApi(process.env.NEWS_API_KEY);
const helper = require('./helper-bot.js');

async function getCountrySources(countryCode) {
  try {
    const response = await newsapi.v2.sources({
      country: countryCode,
    });
    const sourceIds = response.sources.map(e => e.id);
    return sourceIds;
  } catch (err) {
    console.log('Error getting sources.', err);
  }
}

function removeDuplicateArticles(news) {
  const titles = [];
  return news.articles.filter(article => {
    if (!titles.includes(article.title)) {
      titles.push(article.title);
      return true;
    } else {
      return false;
    }
  });
}

async function getCountryNews(countryCode, page) {
  try {
    let sinceDate = helper.getPrevDay(2, new Date());
    sinceDate = helper.getISO(sinceDate);
    const sourceIds = await getCountrySources(countryCode);
    let sources = '';
    if (sourceIds.length > 0) {
      sources = sourceIds.reduce((sources, id) => {
        return (sources += ',' + id);
      });
      const news = await newsapi.v2.everything({
        q: '(coronavirus OR covid-19)',
        sources,
        sortBy: 'publishedAt',
        from: sinceDate,
        pageSize: '10',
        page,
      });
      news.articles = removeDuplicateArticles(news);
      return news;
    }
  } catch (err) {
    console.log('Error getting country news.', err);
  }
}

module.exports = {
  getCountryNews,
};

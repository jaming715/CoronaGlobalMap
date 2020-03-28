const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const NewsApi = require('newsapi');
const newsapi = new NewsApi(process.env.NEWS_API_KEY);
const helper = require('../../data-bots/helper-bot.js');

router.get('/top-headlines', async (req, res) => {
  try {
    const news = await newsapi.v2.topHeadlines({
      q: '(coronavirus OR covid-19)',
    });
    res.send(news);
  } catch (err) {
    console.log('Error retrieving news.', err);
  }
});

router.get('/top-headlines/:countryId', async (req, res) => {
  try {
    const countryCode = req.params.countryId.toLowerCase();
    const news = await newsapi.v2.topHeadlines({
      q: '(coronavirus OR covid-19)',
      country: countryCode,
    });
    res.send(news);
  } catch (err) {
    console.log('Error retrieving news.', err);
  }
});

router.get('/sources/:countryId', async (req, res) => {
  try {
    const countryCode = req.params.countryId.toLowerCase();
    const sources = await newsapi.v2.sources({
      country: countryCode,
    });
    res.send(sources);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/sources/', async (req, res) => {
  try {
    const sources = await newsapi.v2.sources();
    res.send(sources);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/everything/:page/', async (req, res) => {
  try {
    let sinceDate = helper.getPrevDay(7, new Date());
    sinceDate = helper.getISO(sinceDate);
    const page = req.params.page;
    // const sortBy = req.params.sortBy;
    const news = await newsapi.v2.everything({
      q: '(coronavirus OR covid-19)',
      sortBy: 'publishedAt',
      from: sinceDate,
      pageSize: '10',
      language: 'en',
      page,
    });
    const titles = [];
    if (news.articles) {
      news.articles = news.articles.filter(article => {
        if (!titles.includes(article.title)) {
          titles.push(article.title);
          return true;
        } else {
          return false;
        }
      });
    }
    res.send(news);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/sources/:countryId/', async (req, res) => {
  try {
    const countryCode = req.params.countryId.toLowerCase();
    const response = await newsapi.v2.sources({
      country: countryCode,
    });
    res.send(response);
  } catch (err) {
    console.log('Error retrieving sources', err);
  }
});

router.get('/everything/:countryId/:page', async (req, res) => {
  try {
    let sinceDate = helper.getPrevDay(7, new Date());
    sinceDate = helper.getISO(sinceDate);
    const countryCode = req.params.countryId.toLowerCase();
    const response = await newsapi.v2.sources({
      country: countryCode,
    });
    const sourceIds = response.sources.map(e => e.id);
    let sources = '';
    if (sourceIds.length > 0) {
      sources = sourceIds.reduce((sources, id) => {
        return (sources += ',' + id);
      });
      const page = req.params.page;
      const news = await newsapi.v2.everything({
        q: '(coronavirus OR covid-19)',
        sources,
        sortBy: 'publishedAt',
        from: sinceDate,
        pageSize: '10',
        page,
      });
      const titles = [];
      news.articles = news.articles.filter(article => {
        if (!titles.includes(article.title)) {
          titles.push(article.title);
          return true;
        } else {
          return false;
        }
      });
      res.send(news);
    } else {
      res.send({
        articles: [],
      });
    }
  } catch (err) {
    console.log('', err);
  }
});

module.exports = router;

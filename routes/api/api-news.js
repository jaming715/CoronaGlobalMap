const express = require('express');
const router = express.Router();
const News = require('../../models/news-model.js');
const PrNews = require('../../models/pr-news-model.js');

router.get('/', async (req, res) => {
  try {
    const docs = await News.find();
    res.send(docs);
  } catch (err) {
    console.log('Error retrieving news from DB', err);
  }
});

router.get('/PR', async (req, res) => {
  try {
    const docs = await PrNews.find();
    res.send(docs);
  } catch (err) {
    console.log('Error retrieving news from DB', err);
  }
});

router.get('/sources', async (req, res) => {
  try {
    const sources = await News.distinct('source');
    res.send(sources);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/sources/PR', async (req, res) => {
  try {
    const sources = await PrNews.distinct('source');
    res.send(sources);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/NYT', async (req, res) => {
  try {
    const docs = await News.find({source: 'The New York Times'});
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/BBC', async (req, res) => {
  try {
    const docs = await News.find({source: 'BBC News'});
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/CNN', async (req, res) => {
  try {
    const docs = await News.find({source: 'CNN'});
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/FOX', async (req, res) => {
  try {
    const docs = await News.find({source: 'Fox News'});
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/ALL', async (req, res) => {
  res.redirect('./');
});
module.exports = router;

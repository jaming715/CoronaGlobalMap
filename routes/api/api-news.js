const express = require('express');
const router = express.Router();
const News = require('../../models/news-model.js');
const PrNews = require('../../models/pr-news-model.js');
const _ = require('lodash');

router.get('/', async (req, res) => {
  try {
    let docs = await News.find();
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('Error retrieving news from DB', err);
  }
});

router.get('/PR', async (req, res) => {
  try {
    let docs = await PrNews.find();
    docs = _.shuffle(docs);
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
    let docs = await News.find({source: 'New York Times'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/BBC', async (req, res) => {
  try {
    let docs = await News.find({source: 'BBC News'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/CNN', async (req, res) => {
  try {
    let docs = await News.find({source: 'CNN'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/FOX', async (req, res) => {
  try {
    let docs = await News.find({source: 'Fox News'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/ABC', async (req, res) => {
  try {
    let docs = await News.find({source: 'ABC News'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/CBS', async (req, res) => {
  try {
    let docs = await News.find({source: 'CBS News'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/REUTERS', async (req, res) => {
  try {
    let docs = await News.find({source: 'Reuters'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/NBC', async (req, res) => {
  try {
    let docs = await News.find({source: 'NBC News'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/GUARDIAN', async (req, res) => {
  try {
    let docs = await News.find({source: 'The Guardian'});
    docs = _.shuffle(docs);
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/ALL', async (req, res) => {
  res.redirect('./');
});
module.exports = router;

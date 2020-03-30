const express = require('express');
const router = express.Router();
const News = require('../../models/news-model.js');
const PrNews = require('../../models/pr-news-model.js');
const _ = require('lodash');

router.get('/', async (req, res) => {
  try {
    let docs = await News.find().sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('Error retrieving news from DB', err);
  }
});

router.get('/PR', async (req, res) => {
  try {
    let docs = await PrNews.find().sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('Error retrieving news from DB', err);
  }
});

router.get('/ENDI', async (req, res) => {
  try {
    let docs = await PrNews.find({source: 'El Nuevo Dia'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('Error retrieving news from DB', err);
  }
});

router.get('/METRO', async (req, res) => {
  try {
    let docs = await PrNews.find({source: 'Metro Puerto Rico'}).sort({
      pubDate: -1,
    });
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('Error retrieving news from DB', err);
  }
});

router.get('/PRIMERAHORA', async (req, res) => {
  try {
    let docs = await PrNews.find({source: 'Primera Hora'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
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
    let docs = await News.find({source: 'New York Times'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/BBC', async (req, res) => {
  try {
    let docs = await News.find({source: 'BBC News'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/CNN', async (req, res) => {
  try {
    let docs = await News.find({source: 'CNN'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/FOX', async (req, res) => {
  try {
    let docs = await News.find({source: 'Fox News'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/ABC', async (req, res) => {
  try {
    let docs = await News.find({source: 'ABC News'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/CBS', async (req, res) => {
  try {
    let docs = await News.find({source: 'CBS News'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/REUTERS', async (req, res) => {
  try {
    let docs = await News.find({source: 'Reuters'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/NBC', async (req, res) => {
  try {
    let docs = await News.find({source: 'NBC News'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/GUARDIAN', async (req, res) => {
  try {
    let docs = await News.find({source: 'The Guardian'}).sort({pubDate: -1});
    docs.filter(doc => doc.version === 'latest');
    res.send(docs);
  } catch (err) {
    console.log('', err);
  }
});

router.get('/ALL', async (req, res) => {
  res.redirect('./');
});
module.exports = router;

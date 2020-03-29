const axios = require('axios');
const _ = require('lodash');
let Parser = require('rss-parser');
let parser = new Parser();
const keywords = ['coronavirus', 'covid-19'];

const newsOutlets = [
  {source: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml'},
  {source: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss'},
  {source: 'Fox News', url: 'http://feeds.foxnews.com/foxnews/latest'},
  {
    source: 'New York Times',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  },
  {
    source: 'ABC News',
    url: 'https://abcnews.go.com/abcnews/usheadlines',
  },
  {
    source: 'CBS News',
    url: 'https://www.cbsnews.com/latest/rss/main',
  },
  {
    source: 'Reuters',
    url: 'http://feeds.reuters.com/Reuters/worldNews',
  },
  {
    source: 'NBC News',
    url: 'http://feeds.nbcnews.com/nbcnews/public/news',
  },
  {
    source: 'The Guardian',
    url: 'https://www.theguardian.com/us-news/rss',
  },
  // {source: 'Wired', url: 'https://www.wired.com/feed/rss'},
];

const prNewsOutlets = [
  {source: 'El Nuevo Dia', url: 'https://www.elnuevodia.com/rss/loultimo'},
  {
    source: 'Metro Puerto Rico',
    url:
      'http://www.pressdisplay.com/pressdisplay/services/rss.ashx?cid=9181&type=full',
  },
  {
    source: 'Primera Hora',
    url:
      'http://www.pressdisplay.com/pressdisplay/services/rss.ashx?cid=e212&type=full',
  },
];

function containsKeywords(str) {
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    if (str.includes(keyword)) return true;
  }
  return false;
}

function keywordFilterByTitle(articles) {
  const filtered = [];
  articles.forEach(article => {
    const title = article.title.toLowerCase().replace(' ', '');
    if (containsKeywords(title)) {
      filtered.push(article);
    }
  });
  return filtered;
}

function keywordFilterByTitleAndContent(articles) {
  const filtered = [];
  articles.forEach(article => {
    const title = article.title.toLowerCase().replace(' ', '');
    const contentSnip = article.contentSnippet
      ? article.contentSnippet.toLowerCase().replace(' ', '')
      : '';
    if (containsKeywords(title) || containsKeywords(contentSnip)) {
      filtered.push(article);
    }
  });
  return filtered;
}

async function rssFeedTest() {
  let feed = await parser.parseURL(
    'http://www.pressdisplay.com/pressdisplay/services/rss.ashx?cid=e212&type=full',
  );
  const filtered = keywordFilterByTitleAndContent(feed.items);
  console.log(filtered);
}

async function getFeed(url) {
  let feed = await parser.parseURL(url);
  const keywordFiltered = keywordFilterByTitleAndContent(feed.items);
  return keywordFiltered;
}

async function getTopStoryFeeds() {
  let articles = [];
  for (let i = 0; i < newsOutlets.length; i++) {
    const newsOutlet = newsOutlets[i];
    const feedUrl = newsOutlet.url;
    const feed = await getFeed(feedUrl);
    feed.forEach(article => (article.source = newsOutlet.source));
    articles = _.concat(articles, feed);
  }
  articles = _.shuffle(articles);
  // console.log(articles);
  return articles;
}

async function getPrStoryFeeds() {
  let articles = [];
  for (let i = 0; i < prNewsOutlets.length; i++) {
    const newsOutlet = prNewsOutlets[i];
    const feedUrl = newsOutlet.url;
    const feed = await getFeed(feedUrl);
    feed.forEach(article => (article.source = newsOutlet.source));
    articles = _.concat(articles, feed);
  }
  articles = _.shuffle(articles);
  // console.log(articles);
  return articles;
}

// rssFeedTest();
// getTopStoryFeeds();
// getPrStoryFeeds();

module.exports = {
  getTopStoryFeeds,
  getPrStoryFeeds,
};

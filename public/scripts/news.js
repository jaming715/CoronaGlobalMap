function getReadMoreLink(url) {
  const div = document.createElement('div');
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.innerHTML = 'Read More';
  div.appendChild(link);
  return div.innerHTML;
}

function getArticleHTML(article) {
  const author =
    article.author === '' || !article.author ? 'N/A' : article.author;
  let date = article.publishedAt;
  const lastCharIndex = date.indexOf('T');
  date = date.slice(0, lastCharIndex);
  description = article.description.length > 5 ? article.description : '';
  return `<div class="news-article">
        <div class="article-title">
         <div>${article.title}</div>
          <div class="source"> <strong>Source:</strong> ${
            article.source.name
          } </div>
        </div>
        <div class="article-body">
          <div class="authors"> <strong>Author(s):</strong> ${author} </div>
          <div class="date"> <strong>Published: </strong> <span class="published">${date}</span> </div>
          <p class="article-description"><strong> Description: </strong> </br> ${description} </p>
          ${getReadMoreLink(article.url)}
          ${
            article.urlToImage
              ? `<img class="article-img" src=${article.urlToImage} alt="No Article Image"/>`
              : ''
          }
        </div>
      </div>`;
}

let currPage = 1;
function setUpPageButtons(countryCode, numArticles) {
  const numPerPage = 10;
  const lastPage = Math.ceil(numArticles / numPerPage);
  $('#p-tot').html(numWithCommas(lastPage));
  $('#back').on('click', async function() {
    if (currPage !== 1) {
      currPage--;
      $('#back-to-top').hide();
      $('#news').fadeOut();
      $('#p-num').html(currPage.toString() + ' ');
      const countryNews = await getCountryNews(countryCode, currPage);
      const articles = countryNews.articles;
      setUpCountryNews(articles, currPage);
    }
  });
  $('#next').on('click', async function() {
    if (currPage !== lastPage) {
      currPage++;
      $('#p-num').html(currPage.toString() + ' ');
      $('#back-to-top').hide();
      $('#news').fadeOut();
      const countryNews = await getCountryNews(countryCode, currPage);
      const articles = countryNews.articles;
      setUpCountryNews(articles, currPage);
    }
  });
}

function setUpCountryNews(articles, page) {
  $('#news').empty();
  articles.forEach(article => {
    $('#news').append(getArticleHTML(article));
  });
  $('#news').fadeIn();
  $('#back-to-top').show();
}

async function setUpNews(countryCode) {
  const countryNews = await getCountryNews(countryCode, 1);
  if (countryNews.articles.length === 0) {
    $('#news-headlines').html('News for this country is still not supported');
    $('#page-buttons').hide();
    $('#page-num').hide();
    $('#back-to-top').hide();
    return;
  }
  const articles = countryNews.articles;
  setUpPageButtons(countryCode, countryNews.totalResults);
  setUpCountryNews(articles, 1);
  $('#back-to-top').on('click', function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
}

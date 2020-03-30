const pageSize = 10;
let articles = undefined;
let selected = undefined;

function hideNews() {
  $('#page-buttons').hide();
  $('#news').hide();
  $('#news-loading-icon').show();
}

function showHiddenNews() {
  $('#news-loading-icon').hide();
  $('#news').show();
  $('#page-buttons').show();
}

function scrollToTop() {
  $('html, body').animate({scrollTop: 0}, 500);
}

let currPage = 0;
function setUpPageButtons() {
  const lastPage = Math.ceil(articles.length / pageSize);
  if (lastPage === 1) {
    $('#page-buttons').hide();
  } else {
    $('#page-buttons').show();
  }
  $('#p-tot').html(lastPage);
  $('#back').on('click', async function() {
    if (currPage === 1) {
      $('#back').hide();
    }
    if (currPage > 0) {
      $('#next').show();
      currPage--;
      scrollToTop();
      hideNews();
      $('#p-num').html((currPage + 1).toString() + ' ');
      showNews(currPage);
    }
  });
  $('#next').on('click', async function() {
    if (currPage < lastPage) {
      $('#back').show();
      currPage++;
      if (currPage === lastPage - 1) $('#next').hide();
      scrollToTop();
      hideNews();
      $('#p-num').html((currPage + 1).toString() + ' ');
      showNews(currPage);
    }
  });
}

function getReadMoreLink(article) {
  const url = article.link;
  const div = document.createElement('div');
  const link = document.createElement('a');
  let linkStr = 'Read More';
  if (
    article.source === 'Primera Hora' ||
    article.source === 'Metro Puerto Rico'
  ) {
    linkStr = 'Visit News Site';
  }
  link.setAttribute('href', url);
  link.innerHTML = linkStr;
  div.appendChild(link);
  return div.innerHTML;
}

function getArticleHTML(article) {
  if (!article) return;
  let author = 'N/A';
  if (article.author) author = article.author;
  let date = article.pubDate;
  if (article.pubDate !== '--') {
    date = article.pubDate;
    const lastCharIndex = date.indexOf('T');
    date = date.slice(0, lastCharIndex);
  }
  description = article.contentSummary ? article.contentSummary : 'N/A';
  return `<div class="news-article">
        <div class="article-title">
         <div>${article.title}</div>
          <div class="source"> <strong>Source:</strong> ${article.source} </div>
        </div>
        <div class="article-body">
          <div class="authors"> <strong>Author(s):</strong> ${author} </div>
          <div class="date"> <strong>Published: </strong> <span class="published">${date}</span> </div>
          <p class="article-description"><strong> Description: </strong> </br> ${description} </p>
          ${getReadMoreLink(article)}
        </div>
      </div>`;
}

function showNews(page) {
  $('#news').empty();
  const showing = [];
  const first = page * pageSize;
  const last = first + pageSize - 1;
  for (let i = first; i <= last; i++) {
    const article = articles[i];
    showing.push(article);
    $('#news').append(getArticleHTML(article));
  }
  showHiddenNews();
}

const srcNameToCode = {
  'New York Times': 'NYT',
  'Fox News': 'FOX',
  CNN: 'CNN',
  'BBC News': 'BBC',
  'ABC News': 'ABC',
  'CBS News': 'CBS',
  Reuters: 'REUTERS',
  'NBC News': 'NBC',
  'The Guardian': 'GUARDIAN',
  'El Nuevo Dia': 'ENDI',
  'Metro Puerto Rico': 'METRO',
  'Primera Hora': 'PRIMERAHORA',
};

function setBackNormal(btn, srcBtn) {
  $(btn).css('background-color', $(srcBtn).css('fill'));
  $(btn).css('color', $(srcBtn).css('stroke'));
}

function setBackSelected(btn, srcBtn) {
  $(btn).css('background-color', $(srcBtn).css('stroke'));
  $(btn).css('color', $(srcBtn).css('fill'));
}

async function showSourceButtons() {
  const sources = await getSources();
  if (sources.length === 1) return;
  $('#filter').show();
  sources.forEach(source => {
    $('#src-buttons').append(`<div class="src-btn btn">${source}</div>`);
  });
}

async function refreshFeed(srcCode) {
  hideNews();
  articles = await getNewsFromSource(srcCode);
  currPage = 0;
  $('#p-num').html((currPage + 1).toString() + ' ');
  $('#back').off();
  $('#next').off();
  showNews(0);
  $('#page-buttons').show();
  setUpPageButtons();
}

async function setUpSourceButtons(page) {
  await showSourceButtons();
  const url = document.location.href;
  $('.src-btn').on('click', async function() {
    let srcCode = srcNameToCode[$(this).html()];
    if (selected) {
      setBackNormal(selected, this);
      if ($(selected).html() === $(this).html()) {
        selected = undefined;
        srcCode = '';
      } else {
        selected = this;
        setBackSelected(selected, this);
      }
    } else {
      selected = this;
      setBackSelected(selected, this);
    }
    await refreshFeed(srcCode);
  });
}

async function setUpNews() {
  articles = await getNews();
  $('#back').hide();
  setUpSourceButtons();
  setUpPageButtons();
  showNews(0);
}

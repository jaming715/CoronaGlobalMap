const pageSize = 10;
let articles = undefined;
let selected = undefined;

function hideNews() {
  $('#page-num').hide();
  $('#news').hide();
  $('#news-loading-icon').fadeIn();
}

function showHiddenNews() {
  $('#news-loading-icon').fadeOut();
  $('#news').fadeIn();
}

function scrollToTop() {
  $([document.documentElement, document.body]).animate(
    {
      scrollTop: $('body').offset().top,
    },
    2000,
  );
}

let currPage = 0;
function setUpPageButtons() {
  const lastPage = Math.ceil(articles.length / pageSize);
  $('#p-tot').html(numWithCommas(lastPage + 1));
  $('#back').on('click', async function() {
    if (currPage === 1) {
      $('#back').hide();
    }
    if (currPage > 0) {
      $('#next').show();
      currPage--;
      hideNews();
      scrollToTop();
      $('#p-num').html((currPage + 1).toString() + ' ');
      showNews(currPage);
    }
  });
  $('#next').on('click', async function() {
    if (currPage === lastPage - 1) {
      $('#next').hide();
    }
    if (currPage < lastPage) {
      $('#back').show();
      currPage++;
      hideNews();
      scrollToTop();
      $('#p-num').html((currPage + 1).toString() + ' ');
      showNews(currPage);
    }
  });
}

function getReadMoreLink(url) {
  const div = document.createElement('div');
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.innerHTML = 'Read More';
  div.appendChild(link);
  return div.innerHTML;
}

function getArticleHTML(article) {
  if (!article) return;
  let author = 'N/A';
  if (article.author) author = article.author;
  let date = article.pubDate;
  if (article.pubDate) {
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
          ${getReadMoreLink(article.link)}
        </div>
      </div>`;
}

function showNews(page) {
  $('#news').empty();
  for (let i = page; i < pageSize; i++) {
    const article = articles[i];
    $('#news').append(getArticleHTML(article));
  }
  showHiddenNews();
  $('#page-num').show();
}

const srcNameToCode = {
  'The New York Times': 'NYT',
  'Fox News': 'FOX',
  CNN: 'CNN',
  'BBC News': 'BBC',
};

function setBackNormal(btn, srcBtn) {
  $(btn).css('background-color', $(srcBtn).css('fill'));
  $(btn).css('color', $(srcBtn).css('stroke'));
}

function setBackSelected(btn, srcBtn) {
  $(btn).css('background-color', $(srcBtn).css('stroke'));
  $(btn).css('color', $(srcBtn).css('fill'));
}

async function setUpSourceButtons(page) {
  const sources = await getSources();
  if (sources.length === 1) return;
  sources.forEach(source => {
    $('#src-buttons').append(`<div class="src-btn btn">${source}</div>`);
  });
  // $('#src-buttons').append(`<div id="all" class="src-btn btn">All</div>`);
  $('.src-btn').on('click', async function() {
    const src = $(this).html();
    let srcCode = srcNameToCode[src];
    if (selected) {
      setBackNormal(selected, this);
      if ($(selected).html() === $(this).html()) {
        selected = undefined;
        srcCode = 'ALL';
      } else {
        selected = this;
        setBackSelected(selected, this);
      }
    } else {
      selected = this;
      setBackSelected(selected, this);
    }
    $('#page-buttons').hide();
    hideNews();
    articles = await getNewsFromSource(srcCode);
    currPage = 0;
    $('#p-num').html((currPage + 1).toString() + ' ');
    $('#back').off();
    $('#next').off();
    showNews(0);
    $('#page-buttons').show();
    setUpPageButtons();
  });
}

async function setUpNews() {
  articles = await getNews();
  $('#back').hide();
  setUpSourceButtons();
  setUpPageButtons();
  showNews(0);
  // console.log(newsArticles);
}

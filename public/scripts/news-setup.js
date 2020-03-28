async function setUp() {
  const url = window.location.href;
  const countryCode = url.substring(url.lastIndexOf('/') + 1);
  await setUpNews(countryCode);
  finishedLoading();
}
setUp();

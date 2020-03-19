const axios = require('axios');
const CSV = require('csv-string');
const fs = require('fs').promises;
const helper = require('./helper-bot.js');
const johnBot = require('./john-bot.js');
const endpoint = `https://simplemaps.com/static/svg`;

async function writeMap(map, fileName) {
  try {
    await fs.writeFile(__dirname + '/../public/svg/' + fileName, map, 'utf8');
    console.log(`Map has been saved to ${fileName} file`);
  } catch (err) {
    console.log(`Error writing to ${fileName} file`, err);
  }
}

async function downloadMaps() {
  const countries = await johnBot.getJSON();
  countries.forEach(async country => {
    const code = country.code.toLowerCase();
    const mapUrl = `${endpoint}/${code}/${code}.svg`;
    try {
      const map = await axios.get(mapUrl);
      await writeMap(map.data, `${code}.svg`);
    } catch (err) {
      console.log(`Error retrieving ${country.location}'s Map`);
    }
  });
}
downloadMaps();

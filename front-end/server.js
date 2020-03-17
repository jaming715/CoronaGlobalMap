const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || '3000';

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'pug');

// app.get('/', function(req, res) {
//   res.render('index', {title: 'CoronaMap App', message: 'Hola mijo :)'});
// });

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

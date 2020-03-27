const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {updateCountries} = require('./country-manager.js');

dotenv.config();
const uri = process.env.MONGO_CONNECT_STR;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

updateCountries();

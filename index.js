const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const osmosis = require('osmosis');
const User = require('./src/User/User');

const user = new User(username, password);



// module.exports = scraper;

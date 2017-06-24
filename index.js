const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const osmosis = require('osmosis');
const User = require('./src/User/User');

const user = new User(username, password);

user.login(osmosis)
    .then((result) => {
        console.log(result);
        user.getCourses(osmosis)
        	.then(r => console.log(r), e => console.log(e));
    }, reject => console.log(reject));

// module.exports = scraper;

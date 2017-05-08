const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const osmosis = require('osmosis');
const auth = require('./src/auth');

const debug = require('debug')('main');

class scraper {
    constructor(username, password, agent) {
        // super();
        this.username = username;
        this.password = password;
        this.agent = agent;

        auth.login(this.username, this.password, this.agent);
    }
}

auth.keepLoggedIn(username, password, osmosis);






// module.exports = scraper;

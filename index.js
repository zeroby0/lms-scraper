const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const osmosis = require('osmosis');
const auth = require('./src/auth');
const user = require('./src/user');

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

// auth.keepLoggedIn(username, password, osmosis);

auth.login(username, password, osmosis).then(function (result) {
    user.getLoginInfo(osmosis)
        .then((result) => {
            console.log(result);
        }, (err) => {
            console.log("Error occured " + err);
        });
});

// user.getLoginInfo(osmosis)
//     .then((result) => {
//         console.log(result);
//     }, (err) => {
//         console.log("Error occured " + err);
//     });







// module.exports = scraper;

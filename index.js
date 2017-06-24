const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const osmosis = require('osmosis');
const User = require('./src/User/User');

const user = new User(username, password);
const net = require('./src/Helpers/Network');

user.login(osmosis)
    .then((res) => {
        console.log(res);
        User.getPrivateFiles(osmosis)
            .then((result) => {
                net.downloadURL(result.link[0], './isla/', user.getCookies())
                    .then((r) => console.log(r), (e) => console.log(e));
            }, (reject) => {
                console.log(reject);
            }, (err) => console.log(err));




    }, (err) => {
        console.log(err);
    });


// module.exports = scraper;

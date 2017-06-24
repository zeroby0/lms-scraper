const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const osmosis = require('osmosis');
const User = require('./src/User/User');

const user = new User(username, password);
// const net = require('./src/Helpers/Network');


const Course = require('./src/Course/Course');

const course = new Course('https://lms.iiitb.ac.in/moodle/course/view.php?id=816');

function onLogin(osmosis) {
    course.getMaterial(osmosis)
    .then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    });
}

user.login(osmosis)
    .then((res) => {
        // console.log(res);
        onLogin(osmosis);
    }, (err) => {
        console.log(err);
    });


// module.exports = scraper;

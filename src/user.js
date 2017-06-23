// const config = require('config');
const debug = require('debug')('auth');
const Promise = require('bluebird');

class user {
    static getLoginInfo(agent) {
        const homeString = 'https://lms.iiitb.ac.in/moodle/my/';
        const headerMenu = '.headermenu';
        const loginInfoDiv = '.logininfo';

        return new Promise((resolve, reject) => {
            agent
                .get(homeString)
                // .wait(headerMenu)
                .find(headerMenu)
                .set({
                    loginInfo: loginInfoDiv,
                })
                .data((data) => {
                    if(data){
                        resolve(data);
                    } else {
                        reject("Null data value found.")
                    }
                })
                .error(err => reject(err));
        });
    }
}


module.exports = user;
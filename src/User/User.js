const config = require('config');
const debug = require('debug')('User');
const Auth = require('../Auth/Auth');
const Person = require('./Person');

class User extends Person {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    setCookies(cookies) {
        this.cookies = cookies;
    }

    getCookies() {
        return this.cookies;
    }

    static async isLoggedin(agent) {
        return Auth.isLoggedin(agent);
    }

    async login(agent) {
        return new Promise((resolve, reject) => {
            Auth.login(this.username, this.password, agent)
                .then((result) => {
                    if (result.code === 0) {
                        debug(result);
                        this.setCookies(result.cookies);
                    }
                    resolve(result);
                }, (reject1) => reject(reject1));
        });
    }

    async keepLoggein(agent) {
        const timeOut = config.get('params.onlineTimeout');
        Auth.keepLoggein(this.username, this.password, agent, timeOut);
    }

    static async getCourses(agent) {
        const base = config.get('url.base');
        const home = config.get('url.home');

        return new Promise((resolve, reject) => {
            agent.get(base + home)
                .find('#page-content')
                .set({
                    link: ['.corner-box .content .course_list h2 @href'],
                    name: ['.corner-box .content .course_list h2'],
                })
                .data((data) => {
                    // debug(data);
                    resolve(data);
                })
                .error((err) => {
                    debug(err);
                    reject(err);
                });
        });
    }

    static async getPrivateFiles(agent) {
        const base = config.get('url.base');
        const home = config.get('url.home');

        return new Promise((resolve, reject) => {
            agent.get(base + home)
                .find('div[id^="private_files_tree_"]')
                .set({
                    link: ['a @href'],
                    name: ['a'],
                })
                .data((data) => {
                    // debug(data);
                    resolve(data);
                })
                .error((err) => {
                    debug(err);
                    reject(err);
                });
        });

    }
}

module.exports = User;

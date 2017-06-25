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

                }, reject1 => reject(reject1));

        });

    }

    async keepLoggein(agent) {

        const timeOut = config.get('params.onlineTimeout');
        Auth.keepLoggein(this.username, this.password, agent, timeOut);

    }

    static async getCourses(agent) {

        // url
        const base = config.get('url.root');
        const home = config.get('url.home');

        // selector
        const courseListSelector = config.get('selector.user.courseList.selector');
        const courseLinkSelector = config.get('selector.user.courseList.link');
        const courseNameSelector = config.get('selector.user.courseList.name');

        // event flags
        const success = config.get('eventFlags.user.getCourses.success');
        const unknownError = config.get('eventFlags.user.getCourses.unknownError');

        return new Promise((resolve, reject) => {

            agent.get(base + home)
                .find(courseListSelector)
                .set({
                    link: [courseLinkSelector],
                    name: [courseNameSelector],
                })
                .data((data) => {

                    // debug(data);
                    const result = Object.assign(success, { data: [data.link, data.name] });
                    resolve(result);

                })
                .error((err) => {

                    debug(err);
                    const error = Object.assign(unknownError, { error: err });
                    reject(error);

                });

        });

    }

    static async getPrivateFiles(agent) {

        const base = config.get('url.root');
        const home = config.get('url.home');

        return new Promise((resolve, reject) => {

            agent.get(base + home)
                .find(config.get('selector.user.privateFiles.selector'))
                .set({
                    link: [config.get('selector.user.privateFiles.link')],
                    name: [config.get('selector.user.privateFiles.name')],
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

const config = require('config');
const cookie = require('cookie');
const debug = require('debug')('auth');
const Promise = require('bluebird');


class Auth {
    static async isLoggedin(agent) {

        // url
        const base = config.get('url.root');
        const home = config.get('url.home');

        // css selectors
        const pageTitle = config.get('selector.site.pageTitle');
        const userStatus = config.get('selector.site.userStatus');

        // event flags
        const success = config.get('eventFlags.auth.isLoggedin.success');
        const nullValue = config.get('eventFlags.auth.isLoggedin.nullValue');
        const cannotConnect = config.get('eventFlags.auth.isLoggedin.cannotConnect');
        const unknownError = config.get('eventFlags.auth.isLoggedin.unknownError');


        return new Promise((resolve, reject) => {

            agent
                .get(base + home)
                // .wait(pageTitle)
                .find(pageTitle)
                .set({
                    status: userStatus,
                })
                .data((data) => {

                    if (data) {

                        const result = Object.assign(success, { data: data.status });  // copy json object
                        resolve(result);

                    } else {
                        const error = Object.assign(nullValue, { error: 'data object is empty' });
                        reject(error);
                    } 

                })
                .error((err) => {

                    debug(err.name);
                    if (err.substring(0, 5) === '(get)') {

                        debug('login: Check network');
                        const error = Object.assign(cannotConnect, {error: err});
                        reject(error);

                    } else {

                        debug('login: %s: %s', 'Error Occured', err);
                        const error = Object.assign(unknownError, { error: err });  // copy json object
                        reject(error);

                    }

                });

        });

    }

    static async login(username, password, agent) {

        // url
        const base = config.get('url.root');
        const login = config.get('url.login');

        // selectors
        const pageTitle = config.get('selector.site.pageTitle');
        const userStatus = config.get('selector.site.userStatus');
        const loggedOut = config.get('selector.site.loggedOut');
        const loggedIn = config.get('selector.site.loggedIn');

        // event flags
        const success = config.get('eventFlags.auth.login.success');
        const invalidCreds = config.get('eventFlags.auth.login.invalidCreds');
        const headerMismatch = config.get('eventFlags.auth.login.headerMismatch');
        const cannotConnect = config.get('eventFlags.auth.login.cannotConnect');
        const unknownError = config.get('eventFlags.auth.login.unknownError');

        // 0 readability. Promise.
        return new Promise((resolve, reject) => {

            let tempCookies;
            agent
                .get(base + login)
                // .wait(pageTitle)
                .login(username, password)
                .then((result) => {

                    tempCookies = cookie.parse(result.request.headers.cookie);

                })
                .find(pageTitle)
                .set({
                    status: userStatus,
                })
                .data((data) => {

                    if (data.status === loggedOut) { // still logged out.

                        debug('login: %s', 'Wrong credentials.');
                        resolve(invalidCreds);

                    } else {

                        const partInfo = data.status.substring(0, loggedIn.length);

                        if (partInfo === loggedIn) { // logged in

                            agent.config('cookies', tempCookies); // set cookies
                            debug('login: %s', 'login succesful!');

                            const statusAndCookies = { data: data.status, cookies: tempCookies };
                            const result = Object.assign(success, statusAndCookies); // copy json object

                            resolve(result);

                        } else { // error occured

                            debug('login: %s: %s', 'Unable to log in. Header strings don\'t match', data.logininfo);
                            reject(headerMismatch);

                        }

                    }

                })
                .error((err) => {

                    if (err === '(find) no results for "'.concat(pageTitle).concat('"')) {

                        debug('login: invalid credentials');
                        resolve(invalidCreds);

                    } else if (err.substring(0, 5) === '(get)') {

                        debug('login: Check network');
                        reject(cannotConnect);

                    } else {

                        debug('login: %s: %s', 'Error Occured', err);
                        const error = Object.assign(unknownError, { error: err });
                        reject(error);

                    }

                });

        });

    }

    static async keepLoggedIn(username, password, agent, interval = 3000) {

        function wrapperFunction() {

            Auth.login(username, password, agent)
                .then(
                    (result) => {

                        debug('keepLoggedIn: %s', result);

                    },
                    (err) => {

                        if (err === '(login) No login form found') {

                            debug('keepLoggedIn (info): %s', 'Already logged in');

                        } else {

                            debug('keepLoggedIn (err): %s', err);

                        }

                    })
                .error((err) => {

                    debug('keepLoggedIn: [Err] %s', err);

                });
            setTimeout(wrapperFunction, interval);

        }
        wrapperFunction();

    }
}

module.exports = Auth;

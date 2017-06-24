const config = require('config');
const cookie = require('cookie');
const debug = require('debug')('auth');
const Promise = require('bluebird');


class Auth {
    static async isLoggedin(agent) {
        const base = config.get('url.base');
        const home = config.get('url.home');

        const pageTitle = config.get('class.headerMenu');
        const userStatus = config.get('class.userStatus');

        return new Promise((resolve, reject) => {
            agent
                .get(base + home)
                // .wait(pageTitle)
                .find(pageTitle)
                .set({
                    status: userStatus,
                })
                .data((data) => {
                    if (data) resolve(data.status);
                    else reject('Null Value');
                })
                .error((err) => {
                    debug(err.name);
                    if (err.substring(0, 5) === '(get)') {
                        debug('login: Check network');
                        reject('cannotConnect');
                    } else {
                        debug('login: %s: %s', 'Error Occured', err);
                        reject(err);
                    }
                });
        });
    }

    static async login(username, password, agent) {
        const base = config.get('url.base');
        const login = config.get('url.login');

        const pageTitle = config.get('class.headerMenu');
        const userStatus = config.get('class.userStatus');

        const loggedOut = config.get('status.loggedOut');
        const loggedIn = config.get('status.loggedIn');


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
                    if (data.status === loggedOut) {
                        debug('login: %s', 'Wrong credentials.');
                        resolve('invalidCredentials');
                    } else {
                        const partInfo = data.status.substring(0, loggedIn.length);

                        if (partInfo === loggedIn) { // logged in
                            agent.config('cookies', tempCookies); // set cookies
                            debug('login: %s', 'login succesful!');
                            resolve({ status: 'authenticated', cookies: tempCookies, code: 0 });
                        } else { // error occured
                            debug('login: %s: %s', 'Unable to log in. Header strings don\'t match', data.logininfo);
                            reject({ status: 'headerMismatch', code: 2 });
                        }
                    }
                })
                .error((err) => {
                    if (err === '(find) no results for "'.concat(pageTitle).concat('"')) {
                        debug('login: invalid credentials');
                        resolve({ status: 'invalidCredentials', code: 1 });
                    } else if (err.substring(0, 5) === '(get)') {
                        debug('login: Check network');
                        reject({ status: 'cannotConnect', code: 3 });
                    } else {
                        debug('login: %s: %s', 'Error Occured', err);
                        reject({ statue: 'Error', error: err, code: 4 });
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

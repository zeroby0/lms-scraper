const config = require('config');
const cookie = require('cookie');
const debug = require('debug')('auth');
const Promise = require('bluebird');

// WARN: Super duplicated code

class auth {
    static isLoggedIn(agent) {
        const loginUrl = config.get('url.home');
        const headerDivClass = '.headermenu';
        const loginInfoDivClass = '.logininfo';

        const loggedOut = 'You are not logged in.';
        const loggedIn = 'You are logged in as ';

        return new Promise((resolve, reject) => {
            agent
                .get(loginUrl)
                .find(headerDivClass)
                .set({
                    loginInfo: loginInfoDivClass,
                })
                .data((data) => {
                    if (data.loginInfo === loggedOut) {  // logged out
                        debug('isLoggedIn?: %s', 'is Logged Out.');
                        resolve('loggedOut');
                    } else {
                        const partInfo = data.loginInfo.substring(0, loggedIn.length);

                        if (partInfo === loggedIn) { // logged in
                            debug('isLoggedIn?: %s', 'is Logged In.');
                            resolve('loggedIn');
                        } else { // error!
                            debug('isLoggedIn?: %s: %s', 'Unable to log in. Header strings don\'t match', data.logininfo);
                            reject('Unable to log in. Header strings don\'t match');
                        }
                    }

                })
                .error((err) => {
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

    static login(username, password, agent) {
        const loginUrl = config.get('url.login');

        const headerDivClass = '.headermenu';
        const loginInfoDivClass = '.logininfo';

        const loggedOut = 'You are not logged in.';
        const loggedIn = 'You are logged in as ';

        return new Promise((resolve, reject) => {
            let tempCookies;
            agent
                .get(loginUrl)
                .login(username, password)
                .then((result) => {
                    tempCookies = cookie.parse(result.request.headers.cookie);
                })
                .find(headerDivClass)
                .set({
                    loginInfo: loginInfoDivClass,
                })
                .data((data) => {

                    if (data.loginInfo === loggedOut) { // loggedOut
                        debug('login: %s', 'Wrong Password');
                        resolve('invalidCredentials');
                    } else {
                        const partInfo = data.loginInfo.substring(0, loggedIn.length);

                        if (partInfo === loggedIn) { // logged in
                            agent.config('cookies', tempCookies);
                            debug('login: %s', 'login succesful!');
                            resolve('authenticated');
                        } else { // error occured
                            debug('login: %s: %s', 'Unable to log in. Header strings don\'t match', data.logininfo);
                            reject('Unable to log in. Header strings don\'t match');
                        }
                    }
                })
                .error((err) => {
                    // TODO: Check why this is happening
                    if (err === '(find) no results for "'.concat(headerDivClass).concat('"')) {
                        debug('login: invalid credentials');
                        resolve('invalidCredentials');
                    } else if (err.substring(0, 5) === '(get)') {
                        debug('login: Check network');
                        reject('cannotConnect');
                    } else {
                        debug('login: %s: %s', 'Error Occured', err);
                        reject(err);
                    }
                });
        });
    }

    static keepLoggedIn(username, password, agent) {
        function wrapperFunction() {
            auth.login(username, password, agent)
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
            setTimeout(wrapperFunction, 3000);
        }
        wrapperFunction();
    }
}

module.exports = auth;

const config = require('config');
// const debug = require('debug')('User');
const Auth = require('../Auth/Auth');

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    static async isLoggedin(agent) {
        return Auth.isLoggedin(agent);
    }

    async login(agent) {
        return Auth.login(this.username, this.password, agent);
    }

    async keepLoggein(agent) {
        const timeOut = config.get('params.onlineTimeout');
        Auth.keepLoggein(this.username, this.password, agent, timeOut);
    }
}

module.exports = User;

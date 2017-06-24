const config = require('config');
// const debug = require('debug')('User');
const Auth = require('../Auth/Auth');

class Person {
    setFirstName(firstName) {
        this.firstName = firstName;
    }

    getFirstName() {
        return this.firstName;
    }

    setMiddleName(middleName) {
        this.middleName = middleName;
    }

    getMiddleName() {
        return this.middleName;
    }

    setLastName(lastname) {
        this.lastname = lastname;
    }

    getLastName() {
        return this.lastname;
    }

    setShortName(shortname) {
        this.shortname = shortname;
    }

    getShortName() {
        return this.shortname;
    }

    setFullName(fullname) {
        if (fullname) {
            this.fullname = fullname;
            return true;
        }
        return false;
    }

    getFullName() {
        return this.fullname;
    }
}

class User extends Person{
    constructor(username, password) {
        super();
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

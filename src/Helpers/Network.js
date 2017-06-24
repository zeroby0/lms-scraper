const Promise = require('bluebird');
const dns = require('dns');

class Network {
    static async checkNetwork() {
        return new Promise((resolve) => {
            dns.lookup('www.google.com', (err) => {
                if (err && err.code === 'ENOTFOUND') { resolve(false); }
                else { resolve(true); }
            });
        });
    }
}

module.exports = Network;
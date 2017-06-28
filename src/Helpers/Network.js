const Promise = require('bluebird')
const dns = require('dns')
const jswget = require('jswget')
const config = require('config')
// const cookie = require('cookie')

class Network {
  static async saveCookies (browser) {

  }
  static async downloadURL (url, destination, cookies) {
    process.env.npm_config_strict_ssl = config.get('flags.allowInsecure') !== true
        // to be implemented.
    return new Promise((resolve, reject) => {
      jswget({
        url: 'https://s-media-cache-ak0.pinimg.com/736x/26/00/89/26008978fcdc3244803957d91225a45b--rage-faces-will-smith.jpg',
        onsuccess: (resp, req, res) => {
          resolve(res)
        },
        onerror: (err, req) => {
          reject(err)
        },
        downloadpath: '/Users/aravind/Desktop/lms-scraper/'
      })
    })
  }
  static async checkNetwork () {
    return new Promise((resolve) => {
      dns.lookup('www.google.com', (err) => {
        if (err && err.code === 'ENOTFOUND') {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }
}

module.exports = Network

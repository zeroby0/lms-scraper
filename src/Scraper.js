const osmosis = require('osmosis')

const User = require('./User/User')
const Course = require('./Course/Course')

class Scraper {
  constructor (username, password) {
    this.username = username
    this.password = password
    this.useragent = osmosis
  }

  async login () {
    return User.login(this.username, this.password, this.useragent)
  }

  async getHomeContent () {
    return User.getHomeContent(this.useragent)
  }

  async getCourseContent (courseURL) {
    return Course.getContent(courseURL, this.useragent)
  }
}

module.exports = Scraper

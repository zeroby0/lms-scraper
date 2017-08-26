const Promise = require('bluebird')
const config = require('config')
const osmosis = require('osmosis')
const debug = require('debug')('scraper')

const User = require('./User/User')
const Course = require('./Course/Course')
const Activity = require('./Course/Activity')
const Material = require('./Course/Material')

function clone (obj) {  // this is my new favourite function; deep clones objects
  return JSON.parse(JSON.stringify(obj))
}

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

  async getActivityContent (activityURL) {
    return Activity.getContent(activityURL, this.useragent)
  }

  async getMaterialContent (materialURL) {
    return Material.getContent(materialURL, this.useragent)
  }

  async unknownContext (URL) {
    return new Promise((resolve, reject) => {
      const unknownContext = clone( config.get('response.global.unknownContext') )
      unknownContext.url = URL
      resolve(unknownContext)
    })
  }
}

module.exports = Scraper

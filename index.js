const debug = require('debug')('API');
const config = require('config');
const Scraper = require('./src/Scraper');

class API extends Scraper {
  async getContent(url) {
    const patterns = config.get('patterns');
    const rootURL = patterns.root;
    const login = rootURL + patterns.login;
    const home = rootURL + patterns.home;
    const course = rootURL + patterns.course;
    const forum = rootURL + patterns.forum;
    const material = rootURL + patterns.material;
    const activity = rootURL + patterns.activity;

    let promise;

    switch (true) {
      case url.includes(login):
        debug('getContent: login - %s', url);
        promise = this.login();
        break;
      case url.includes(home):
        debug('getContent: home - %s', url);
        promise = this.getHomeContent();
        break;
      case url.includes(course):
        debug('getContent: course - %s', url);
        promise = this.getCourseContent(url);
        break;
      case url.includes(forum):
        debug('getContent: forum - %s', url);
        break;
      case url.includes(material):
        debug('getContent: material - %s', url);
        promise = this.getMaterialContent(url);
        break;
      case url.includes(activity):
        debug('getContent: activity - %s', url);
        promise = this.getActivityContent(url);
        break;
      default:
        debug('getContent: can\'t resolve - %s', url);
        promise = this.unknownContext(url);
    }

    return promise;
  }
}

module.exports = API;

const Promise = require('bluebird')
const config = require('config')
const debug = require('debug')('course')

function clone (obj) {  // this is my new favourite function; deep clones objects
  return JSON.parse(JSON.stringify(obj))
}

class Course {
  static async getContent (courseURL, useragent) {

    const responses = clone(config.get('response.user.getCourseContent'))

    const success = responses.success
    const cannotConnect = responses.cannotConnect

    const forumSuccess = responses.forumSuccess
    const noForum = responses.noForum

    const materialSuccess = responses.materialSuccess
    const noMaterial = responses.noMaterial

    const activitySuccess = responses.activitySuccess
    const noActivity = responses.noActivity

    success.url = courseURL

    const selector = clone(config.get('selector.course'))

    const forumSectionSelector = selector.forum.forum
    const forumLinkSelector = selector.forum.link
    const forumNameSelector = selector.forum.name

    const activitySectionSelector = selector.activity.activity
    const activitySummarySelector = selector.activity.summary
    const activityLinkSelector = selector.activity.link
    const activityNameSelector = selector.activity.name
    const activityDescriptionSelector = selector.activity.desc



    const materialSectionSelector = selector.material.material
    const materialsummarySelector = selector.material.summary
    const materiallinkSelector = selector.material.link
    const materialnameSelector = selector.material.name
    const materialdescriptionSelector = selector.material.desc



    return new Promise((resolve, reject) => {
      useragent.get(courseURL)
                .find(forumSectionSelector)
                .set({
                  forumLinks: [forumLinkSelector],
                  forumNames: [forumNameSelector]
                })
                .data((data) => {
                  // console.log('Get forums')
                  forumSuccess.data.names = data.forumNames
                  forumSuccess.data.links = data.forumLinks
                  success.data.forums = forumSuccess
                  // console.log('Got forums')
                })
                .then((context, data, next) => { // clear data
                  // context.toString() for HTML Source
                  // console.log(context.toString())
                  next(context, {})
                })
                .error((err) => {
                  // console.log(err, ' : ', courseURL)
                  if (err.substring(0, 5) === '(get)') {
                    debug('login: Check network')
                    cannotConnect.error = err
                    reject(cannotConnect)
                  } else {
                    debug('login: %s: %s', 'Error Occured', err)

                    if (err.substr(-12) === '"#section-0"') { // no forums
                      success.data.forums = noForum
                    } else if (err.substr(-12) === '"#section-1"') { // no material
                      success.data.materials = noMaterial
                    } else if (err.substr(-12) === '"#section-2"') {
                      success.data.activities = noActivity
                    } else {
                      console.log('Error occured in Course.js - id: djfb', err)
                    }

                    // reject(error)
                  }
                })

                .find(activitySectionSelector)
                .set({
                  activitySummary: [activitySummarySelector],
                  activityLinks: [activityLinkSelector],
                  activityNames: [activityNameSelector],
                  activityDescriptions: [activityDescriptionSelector]
                })
                .data((data) => {
                  // console.log('Get activity')
                  activitySuccess.data.summary = data.activitySummary
                  activitySuccess.data.links = data.activityLinks
                  activitySuccess.data.names = data.activityNames
                  activitySuccess.data.descriptions = data.activityDescriptions
                  success.data.activities = activitySuccess
                  // console.log('Got activity')
                })
                .then((context, data, next) => { // clear data
                  next(context, {})
                })

                .find(materialSectionSelector)
                .set({
                  materialSummary: [materialsummarySelector],
                  materialLinks: [materiallinkSelector],
                  materialNames: [materialnameSelector],
                  materialDescriptions: [materialdescriptionSelector]
                })
                .data((data) => {
                  // console.log('Get material')
                  materialSuccess.data.summary = data.materialSummary
                  materialSuccess.data.links = data.materialLinks
                  materialSuccess.data.names = data.materialNames
                  materialSuccess.data.descriptions = data.materialDescriptions
                  success.data.materials = materialSuccess
                  // console.log('Got material')
                  resolve(success)
                })
                .error((err) => {
                  console.log('act ', err)
                })
    })
  }
}

module.exports = Course

const Promise = require('bluebird')
const config = require('config')
const debug = require('debug')('course')

function clone (obj) {  // this is my new favourite function; deep clones objects
  return JSON.parse(JSON.stringify(obj))
}

class Course {
  static async getContent (courseURL, useragent) {
    const success = clone(config.get('response.user.getCourseContent.success'))
    const cannotConnect = clone(config.get('response.user.getCourseContent.cannotConnect'))

    const forumSectionSelector = config.get('selector.course.forum.forum')
    const forumLinkSelector = config.get('selector.course.forum.link')
    const forumNameSelector = config.get('selector.course.forum.name')

    const forumSuccess = clone(config.get('response.user.getCourseContent.forumSuccess'))
    const noForum = clone(config.get('response.user.getCourseContent.noForum'))

    const activitySectionSelector = config.get('selector.course.activity.activity')
    const activitySummarySelector = config.get('selector.course.activity.summary')
    const activityLinkSelector = config.get('selector.course.activity.link')
    const activityNameSelector = config.get('selector.course.activity.name')
    const activityDescriptionSelector = config.get('selector.course.activity.desc')

    const activitySuccess = clone(config.get('response.user.getCourseContent.activitySuccess'))
    const noActivity = clone(config.get('response.user.getCourseContent.noActivity'))

    const materialSectionSelector = config.get('selector.course.material.material')
    const materialsummarySelector = config.get('selector.course.material.summary')
    const materiallinkSelector = config.get('selector.course.material.link')
    const materialnameSelector = config.get('selector.course.material.name')
    const materialdescriptionSelector = config.get('selector.course.material.desc')

    const materialSuccess = clone(config.get('response.user.getCourseContent.materialSuccess'))
    const noMaterial = clone(config.get('response.user.getCourseContent.noMaterial'))

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

  // The following functions are deprecated. DO NOT USE.
  static async getForums (courseURL, agent) {
    const url = courseURL

    debug('getForum: %s', url)

    const forumSelector = config.get('selector.course.forum.forum')

    const linkSelector = config.get('selector.course.forum.link')
    const nameSelector = config.get('selector.course.forum.name')

    const success = config.get('eventFlags.course.forum.success')
    const noForum = config.get('eventFlags.course.forum.noForum')
    const cannotConnect = config.get('eventFlags.course.forum.cannotConnect')
    const unknownError = config.get('eventFlags.course.forum.unknownError')

    return new Promise((resolve, reject) => {
      agent.get(url)
                .find(forumSelector)
                .set({
                  link: [linkSelector],
                  name: [nameSelector]
                })
                .data((data) => {
                    // debug(data);
                  const result = Object.assign(success, data)
                  resolve(result)
                })
                .error((err) => {
                  debug(err)
                  if (err.substring(0, 5) === '(get)') {
                    debug('getForums: Check network')
                    const error = Object.assign(cannotConnect, { error: err })
                    reject(error)
                  } else if (err.substring(0, 6) === '(find)') {
                    debug('getForums: No forum section')
                    const error = Object.assign(noForum, { error: err })
                    reject(error)
                  } else {
                    debug('getForums: %s: %s', 'Error Occured', err)
                    const error = Object.assign(unknownError, { error: err })
                    reject(error)
                  }
                })
    })
  }

  static async getActivities (courseURL, agent) {
    const url = courseURL

    debug('getActivities: %s', url)

    const activitySelector = config.get('selector.course.activity.activity')

    const summarySelector = config.get('selector.course.activity.summary')
    const linkSelector = config.get('selector.course.activity.link')
    const nameSelector = config.get('selector.course.activity.name')
    const descriptionSelector = config.get('selector.course.activity.desc')

    const success = config.get('eventFlags.course.activity.success')
    const noActivity = config.get('eventFlags.course.activity.noActivity')
    const cannotConnect = config.get('eventFlags.course.activity.cannotConnect')
    const unknownError = config.get('eventFlags.course.activity.unknownError')

    return new Promise((resolve, reject) => {
      agent.get(url)
                .find(activitySelector)
                .set({
                  summary: summarySelector,
                  link: [linkSelector],
                  name: [nameSelector],
                  desc: [descriptionSelector]
                })
                .data((data) => {
                    // debug(data);
                  const result = Object.assign(success, data)
                  resolve(result)
                })
                .error((err) => {
                  debug(err)
                  if (err.substring(0, 5) === '(get)') {
                    debug('getActivities: Check network')
                    const error = Object.assign(cannotConnect, { error: err })
                    reject(error)
                  } else if (err.substring(0, 6) === '(find)') {
                    debug('getActivities: No activity section')
                    const error = Object.assign(noActivity, { error: err })
                    reject(error)
                  } else {
                    debug('getMaterial: %s: %s', 'Error Occured', err)
                    const error = Object.assign(unknownError, { error: err })
                    reject(error)
                  }
                })
    })
  }

  static async getMaterials (courseURL, agent) {
    const url = courseURL

    debug('getMaterials: %s', url)

    const materialSelector = config.get('selector.course.material.material')

    const summarySelector = config.get('selector.course.material.summary')
    const linkSelector = config.get('selector.course.material.link')
    const nameSelector = config.get('selector.course.material.name')
    const descriptionSelector = config.get('selector.course.material.desc')

    const success = config.get('eventFlags.course.material.success')
    const noMaterial = config.get('eventFlags.course.material.noMaterial')
    const cannotConnect = config.get('eventFlags.course.material.cannotConnect')
    const unknownError = config.get('eventFlags.course.material.unknownError')

    return new Promise((resolve, reject) => {
      agent.get(url)
                .find(materialSelector)
                .set({
                  summary: summarySelector,
                  link: [linkSelector],
                  name: [nameSelector],
                  desc: [descriptionSelector]
                })
                .data((data) => {
                    // debug(data);
                  const result = Object.assign(success, data)
                  resolve(result)
                })
                .error((err) => {
                  debug(err)
                  if (err.substring(0, 5) === '(get)') {
                    debug('getMaterial: Check network')
                    const error = Object.assign(cannotConnect, { error: err })
                    reject(error)
                  } else if (err.substring(0, 6) === '(find)') {
                    debug('getMaterial: No material section')
                    const error = Object.assign(noMaterial, { error: err })
                    reject(error)
                  } else {
                    debug('getMaterial: %s: %s', 'Error Occured', err)
                    const error = Object.assign(unknownError, { error: err })
                    reject(error)
                  }
                })
    })
  }
}

module.exports = Course

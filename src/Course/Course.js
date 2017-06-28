const Promise = require('bluebird')
const config = require('config')
const debug = require('debug')('course')

class Course {
  constructor (url) {
    this.url = url
  }

    // very similar functions. Let alone to allow flexibility.
  async getForums (agent) {
    const url = this.url

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

  async getActivities (agent) {
    const url = this.url

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

  async getMaterials (agent) {
    const url = this.url

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

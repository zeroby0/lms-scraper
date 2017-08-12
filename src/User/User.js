const config = require('config')
const cookie = require('cookie')
const debug = require('debug')('User')
const Promise = require('bluebird')

function clone (obj) {  // this is my new favourite function; deep clones objects
  return JSON.parse(JSON.stringify(obj))
}

class User {
  static async login (username, password, useragent) {
    // URL
    const url = clone(config.get('url'))
    const base = url.root
    const login = url.login

    // CSS Selector
    const selector = clone(config.get('selector.site'))
    const pageTitle = selector.pageTitle
    const userStatus = selector.userStatus
    const loggedOut = selector.loggedOut
    const loggedIn = selector.loggedIn

    // Responses
    const responses = clone(config.get('response.user.login'))
    const success = responses.success
    const invalidCreds = responses.invalidCreds
    const headerMismatch = responses.headerMismatch
    const cannotConnect = responses.cannotConnect
    const unknownError = responses.unknownError

    // the promise of 0 readability
    // Try to login
    // If Successful, store cookies
    // Otherwise, throw message
    return new Promise((resolve, reject) => {
      let tempCookies
      useragent
                .get(base + login)
                // .wait(pageTitle)
                .login(username, password)
                .then((result) => {
                  tempCookies = cookie.parse(result.request.headers.cookie)
                })
                .find(pageTitle)
                .set({
                  status: userStatus
                })
                .data((data) => {
                  if (data.status === loggedOut) { // still logged out.
                    debug('login: %s', 'Wrong credentials.')
                    resolve(invalidCreds)
                  } else {
                    const partInfo = data.status.substring(0, loggedIn.length)

                    if (partInfo === loggedIn) { // logged in
                      useragent.config('cookies', tempCookies) // set cookies
                      debug('login: %s', 'login succesful!')

                      const statusAndCookies = { data: { status: data.status, cookies: tempCookies } }
                      const result = Object.assign(success, statusAndCookies) // copy json object

                      resolve(result)
                    } else { // error occured
                      debug('login: %s: %s', 'Unable to log in. Header strings don\'t match', data.status)
                      reject(headerMismatch)
                    }
                  }
                })
                .error((err) => {
                  if (err === '(find) no results for "'.concat(pageTitle).concat('"')) {
                    debug('login: invalid credentials')
                    resolve(invalidCreds)
                  } else if (err.substring(0, 5) === '(get)') {
                    debug('login: Check network')
                    reject(cannotConnect)
                  } else {
                    debug('login: %s: %s', 'Error Occured', err)
                    const error = Object.assign(unknownError, { error: err })
                    reject(error)
                  }
                })
    })
  }

  static async getHomeContent (useragent) {
    // URL
    const url = clone(config.get('url'))
    const rootURL = url.root
    const home = url.home

    // Selector
    const cselector = clone(config.get('selector.user.courseList'))
    const courseListSelector = cselector.courseList
    const courseLinkSelector = cselector.courseLink
    const courseNameSelector = cselector.courseName

    const pselector = clone(config.get('selector.user.privateFiles'))
    const privateFilesSelector = pselector.fileList
    const privateFilesLinkSelector = pselector.fileLink
    const privateFilesNameSelector = pselector.fileName

    // Responses
    const responses = clone(config.get('response.user.getHomeContent'))
    const success = responses.success
    const cannotConnect = responses.cannotConnect
    const unknownError = responses.unknownError
    const courseDataSuccess = responses.data.courseDataSuccess
    const filesDataSuccess = responses.data.filesDataSuccess

    return new Promise((resolve, reject) => {
      useragent.get(rootURL + home)
                .find(courseListSelector)
                .set({
                  courseLinks: [courseLinkSelector],
                  courseNames: [courseNameSelector]
                })
                // .doc() // reset find scope to document
                .data((data) => {
                  courseDataSuccess.data.links = data.courseLinks
                  courseDataSuccess.data.names = data.courseNames
                })
                .then((context, data, next) => { // clear data
                  next(context, {})
                })

                .find(privateFilesSelector)
                .set({
                  fileLinks: [privateFilesLinkSelector],
                  fileNames: [privateFilesNameSelector]
                })
                .data((data) => {
                  filesDataSuccess.data.links = data.fileLinks
                  filesDataSuccess.data.names = data.fileNames

                  success.data.courseList = courseDataSuccess
                  success.data.privateFiles = filesDataSuccess

                  resolve(success)
                })
                .error((err) => {
                  if (err.substring(0, 5) === '(get)') {
                    debug('getHomeContent: cannotConnect: %s', err)
                    cannotConnect.error = err
                    reject(cannotConnect)
                  } else {
                    debug('getHomeContent: unknownError: %s', err)
                    unknownError.error = err
                    reject(unknownError)
                  }
                })
    })
  }
}

module.exports = User

const Promise = require('bluebird')
const config = require('config')
const debug = require('debug')('material')

function clone (obj) {  // this is my new favourite function; deep clones objects
  return JSON.parse(JSON.stringify(obj))
}


class Material {
  static async getContent (url, agent) {
    debug('getContents: %s', url)

    const selector = clone(config.get('selector.material'))

    const contentSelector = selector.content
    const linkSelector = selector.link
    const nameSelector = selector.name

    const responses = clone(clone(config.get('response.user.getMaterialContent')))

    const success = responses.success
    const noContent = responses.noContent
    const cannotConnect = responses.cannotConnect
    const unknownError = responses.unknownError

    success.url = url

    return new Promise((resolve, reject) => {
      agent.get(url)
                .find(contentSelector)
                .set({
                  links: [linkSelector],
                  names: [nameSelector],
                })
                .data((data) => {

                  success.data.links = data.links
                  success.data.names = data.names
               
                  resolve(success)
                })
                .error((err) => {
                  debug(err)
                  if (err.substring(0, 5) === '(get)') {
                    debug('getContent: Check network')
                    cannotConnect.error = err
                    reject(cannotConnect)
                  } else if (err.substring(0, 6) === '(find)') {
                    debug('getContent: No material section')
                    noContent.error = err
                    reject(noContent)
                  } else {
                    debug('getContent: %s: %s', 'Error Occured', err)
                    unknownError.error = err
                    reject(unknownError)
                  }
                })
    })
  }
}

module.exports = Material

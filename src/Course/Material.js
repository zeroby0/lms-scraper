const Promise = require('bluebird');
const config = require('config');
const debug = require('debug')('material');

class Material {

    constructor(url) {

        this.url = url;

    }

    async getContents(agent) {

        const url = this.url;

        debug('getContents: %s', url);

        const contentSelector = '.foldertree';

        const linkSelector = config.get('selector.material.link');
        const nameSelector = config.get('selector.material.name');

        const success = config.get('eventFlags.material.getContent.success');
        const noContent = config.get('eventFlags.material.getContent.noContent');
        const cannotConnect = config.get('eventFlags.material.getContent.cannotConnect');
        const unknownError = config.get('eventFlags.material.getContent.unknownError');

        return new Promise((resolve, reject) => {

            agent.get(url)
                .find(contentSelector)
                .set({
                    link: [linkSelector],
                    name: [nameSelector],
                })
                .data((data) => {

                    // debug(data);
                    const result = Object.assign(success, data);
                    resolve(result);

                })
                .error((err) => {

                    debug(err);
                    if (err.substring(0, 5) === '(get)') {

                        debug('getContent: Check network');
                        const error = Object.assign(cannotConnect, { error: err });
                        reject(error);

                    } else if (err.substring(0, 6) === '(find)') {

                        debug('getContent: No material section');
                        const error = Object.assign(noContent, { error: err });
                        reject(error);

                    } else {

                        debug('getContent: %s: %s', 'Error Occured', err);
                        const error = Object.assign(unknownError, { error: err });
                        reject(error);

                    }

                });

        });

    }

}

module.exports = Material;

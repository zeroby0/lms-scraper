const Promise = require('bluebird');
const config = require('config');
const debug = require('debug')('course');


class Course {
    constructor(url) {
        this.url = url;
    }

    getMaterial(agent) {
        const url = this.url;

        debug(url);

        const material = config.get('id.course.material');

        const summarySelector = config.get('selector.user.course.material.summary');
        const linkSelector = config.get('selector.user.course.material.link');
        const nameSelector = config.get('selector.user.course.material.name');
        const descriptionSelector = config.get('selector.user.course.material.desc');

        const cannotConnect = { status: 'cannotConnect', error: 2 };
        const noMaterial = { status: 'noMaterial', error: 1 };
        const unknownError = { status: null, error: 3 };

        return new Promise((resolve, reject) => {
            agent.get(url)
                .find(material)
                .set({
                    summary: summarySelector,
                    link: [linkSelector],
                    name: [nameSelector],
                    desc: [descriptionSelector],
                })
                .data((data) => {
                    // debug(data);
                    const result = Object.assign({}, data);
                    result.error = 0;
                    resolve(result);
                })
                .error((err) => {
                    debug(err);
                    if (err.substring(0, 5) === '(get)') {
                        debug('getMaterial: Check network');
                        reject(cannotConnect);
                    } else if (err.substring(0, 6) === '(find)') {
                        debug('getMaterial: No material section');
                        reject(noMaterial);
                    } else {
                        debug('login: %s: %s', 'Error Occured', err);
                        unknownError.status = err;
                        reject(unknownError);
                    }
                    reject(err);
                });
        });
    }

}

module.exports = Course;
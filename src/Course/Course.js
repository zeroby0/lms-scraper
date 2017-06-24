const Promise = require('bluebird');
const config = require('config');
const debug = require('debug')('course');


class Course {
    constructor(url) {
        this.url = url;
    }

    getMaterial(agent) {
        const url = this.url;
        console.log(url);
        const material = config.get('id.course.material');

        return new Promise((resolve, reject) => {
            agent.get(url)
                .find(material)
                .set({
                    summary: '.summary',
                    link: ['.modtype_folder a @href'],
                    name: ['.modtype_folder a'],
                    desc: ['.contentafterlink p'],
                })
                .data((data) => {
                    // debug(data);
                    resolve(data);
                })
                .error((err) => {
                    debug(err);
                    reject(err);
                });
        });
    }

}

module.exports = Course;
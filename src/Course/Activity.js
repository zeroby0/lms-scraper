const Promise = require('bluebird');
const config = require('config');
const debug = require('debug')('activity');

class Activity {

    constructor(url) {

        this.url = url;

    }

    async getContent(agent) {

        const url = this.url;

        debug('getContents: %s', url);

        const contentSelector = config.get('selector.activity.activity');

        const titleSelector = config.get('selector.activity.title');
        const introSelector = config.get('selector.activity.intro');

        const submissionRSelector = config.get('selector.activity.submissionR');
        const submissionLSelector = config.get('selector.activity.submissionL');

        const feedbackLSelector = config.get('selector.activity.feedbackL');
        const feedbackRSelector = config.get('selector.activity.feedbackR');

        const filesSelector = config.get('selector.activity.files');

        const success = config.get('eventFlags.activity.getContent.success');
        const noContent = config.get('eventFlags.activity.getContent.noContent');
        const cannotConnect = config.get('eventFlags.activity.getContent.cannotConnect');
        const unknownError = config.get('eventFlags.activity.getContent.unknownError');

        return new Promise((resolve, reject) => {

            agent.get(url)
                .find(contentSelector)
                .set({
                    title: titleSelector,
                    intro: introSelector,
                    submissionLeft: [submissionRSelector],
                    submissionRight: [submissionLSelector],
                    feedbackLeft: [feedbackLSelector],
                    feedbackRight: [feedbackRSelector],
                    filesLink: filesSelector,
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

module.exports = Activity;

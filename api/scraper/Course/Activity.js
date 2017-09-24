const Promise = require('bluebird');
const config = require('config');
const debug = require('debug')('activity');
// const pretty = require('pretty');

function getText(html) { // Returns text from HTML while trying to preserve structure
  return html.replace(/<[^>]+>/g, '');
  // https://stackoverflow.com/a/41756926/6364386
}

function clone(obj) { // this is my new favourite function; deep clones objects
  return JSON.parse(JSON.stringify(obj));
}

class Activity {
  static async getContent(activityURL, agent) {
    const url = activityURL;

    debug('getContents: %s', url);

    const selector = clone(config.get('selector.activity'));

    const contentSelector = selector.activity;

    // const titleSelector = selector.title;
    // const introSelector = selector.intro;

    const submissionRSelector = selector.submissionR;
    const submissionLSelector = selector.submissionL;

    const feedbackLSelector = selector.feedbackL;
    const feedbackRSelector = selector.feedbackR;

    const filesSelector = selector.files;

    const responses = clone(config.get('response.user.getActivityContent'));

    const {
      success, noContent, cannotConnect, unknownError,
    } = responses;

    return new Promise((resolve, reject) => {
      // let source;
      let introSrc;
      agent.get(url)

        .find(contentSelector) // General Content
        .set({
          submissionLeft: [submissionLSelector],
          submissionRight: [submissionRSelector],
          filesLink: filesSelector,
          // aname: '#page-content > div > div > div:nth-child(1) > div > div > div > h2',
          // activityName: titleSelector,
          feedbackLeft: [feedbackLSelector],
          feedbackRight: [feedbackRSelector],
        })
      // .then((context, data, next) => { // clear data | get Source of page content
      //   source = context.toString()
      //   data.source = source
      //   next(context, data)
      // })

        .find('#intro') // Intro Content
        .set({
          introLinkTitles: ['a'],
          introLinks: ['a @href'],
          introLists: ['li'],
        })
        .then((context, data, next) => { // get Source of intro area
          introSrc = context.toString();
          // eslint-disable-next-line no-param-reassign
          data.introText = getText(introSrc);
          next(context, data);
        })
        .data((data) => {
          success.data.submission.left = data.submissionLeft;
          success.data.submission.right = data.submissionRight;
          success.data.submission.filesLink = data.filesLink;

          success.data.feedback.left = data.feedbackLeft;
          success.data.feedback.right = data.feedbackRight;

          success.data.intro.linkTitles = data.introLinkTitles;
          success.data.intro.links = data.introLinks;
          success.data.intro.lists = data.introLists;
          success.data.intro.text = data.introText;

          success.url = url;

          resolve(success);
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

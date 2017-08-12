const debug = require('debug')('test')
const API = require('./index')

const username = process.env.LMS_USERNAME
const password = process.env.LMS_PASSWORD

const api = new API(username, password)

const askForCourseContent = (url) => {
  api.getContent(url)
    .then((result) => {
      console.log('_____________________________')
      console.log(url)
      console.log(result)
      // console.log(result.data.forums)
      // console.log(result.data.activities)
      // console.log(result.data.materials)
    }, (error) => console.log(error))
}

const askForHomeContent = () => {
  api.getContent('https://lms.iiitb.ac.in/moodle/my/')
    .then((result) => {
      // debug(result)

      console.log(result.data)

      // console.log("\nCourse List: ")
      // console.log(result.data.courseList)
      // console.log("\nPrivate Files:")
      // console.log(result.data.privateFiles)

      // for(var i = 0; i < result.data.courseList.data.links.length; i ++) {
      //     askForCourseContent(result.data.courseList.data.links[i])
      // }

      askForCourseContent('https://lms.iiitb.ac.in/moodle/course/view.php?id=457')
    }, (error) => debug(error))
}

api.getContent('https://lms.iiitb.ac.in/moodle/login/index.php')
.then((result) => {
  console.log(result)
  askForHomeContent()
}, (message) => {
  debug(message)
})

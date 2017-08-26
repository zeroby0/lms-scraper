const pretty = require('pretty')
const debug = require('debug')('test')
const API = require('./index')

const username = process.env.LMS_USERNAME
const password = process.env.LMS_PASSWORD

const api = new API(username, password)

const askForActivityContent = (url) => {
  console.log('_____________________________')
  console.log('Activity Content')
  console.log(url)
  api.getContent(url)
    .then((result) => {
      console.log(result)
      askForMaterialContent('https://lms.iiitb.ac.in/moodle/mod/folder/view.php?id=6858')
    })
}

const askForMaterialContent = (url) => {
  console.log('_____________________________')
  console.log('Material Content')
  console.log(url)
  api.getContent(url)
    .then((result) => {
      console.log(result)
    })
}

const askForCourseContent = (url) => {
  api.getContent(url)
    .then((result) => {
      console.log('_____________________________')
      console.log('Course content')
      console.log(url)
      console.log(result)

      // console.log(result.data.forums)
      // console.log(result.data.activities)
      // console.log(result.data.materials)
      askForActivityContent('https://lms.iiitb.ac.in/moodle/mod/assign/view.php?id=4067');

      // askForActivityContent(result.data.activities.data.links[0])
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
  // askForMaterialContent('https://lms.iiitb.ac.in/moodle/mod/folder/view.php?id=6858')
  askForHomeContent()
}, (message) => {
  debug(message)
})

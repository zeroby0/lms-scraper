import test from 'ava';

const debug = require('debug')('test');
const API = require('./index');

const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const api = new API(username, password);

const login_url = 'https://lms.iiitb.ac.in/moodle/login/index.php';

const material_url = 'https://lms.iiitb.ac.in/moodle/mod/folder/view.php?id=6858';
const activity_url = 'https://lms.iiitb.ac.in/moodle/mod/assign/view.php?id=7090';
const course_url = 'https://lms.iiitb.ac.in/moodle/course/view.php?id=457';




test('login', async t => {

  const expected = 'You are logged in as ';
  const result = api.getContent(login_url);
  const {data} = await result
  const actual = data.status.substr(0, expected.length);

  t.is(actual, expected);

})

test('material', async t => {
  // blocks till login
  const login = await api.getContent(login_url);

  const material = await api.getContent(material_url);

  t.is(material.code, 0);

})

test('activity', async t => {
  const login = await api.getContent(login_url);

  const activity = await api.getContent(activity_url);

  t.is(activity.code, 0);
})

test('course', async t => {
  const login = await api.getContent(login_url);

  const course = await api.getContent(course_url);

  t.is(course.status, 'success')
})
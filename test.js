import test from 'ava';

// const debug = require('debug')('test');
const API = require('./index');

const username = process.env.LMS_USERNAME;
const password = process.env.LMS_PASSWORD;

const api = new API(username, password);

const loginUrl = 'https://lms.iiitb.ac.in/moodle/login/index.php';

const materialUrl = 'https://lms.iiitb.ac.in/moodle/mod/folder/view.php?id=6858';
const activityUrl = 'https://lms.iiitb.ac.in/moodle/mod/assign/view.php?id=7090';
const courseUrl = 'https://lms.iiitb.ac.in/moodle/course/view.php?id=457';


test('login', async (t) => {
  const result = await api.getContent('https://lms.iiitb.ac.in/moodle/login/index.php');

  t.is(result.status, 'authenticated');
});

test('material', async (t) => {
  // blocks till login
  await api.getContent(loginUrl);

  const material = await api.getContent(materialUrl);

  t.is(material.code, 0);
});

test('activity', async (t) => {
  await api.getContent(loginUrl);

  const activity = await api.getContent(activityUrl);

  t.is(activity.code, 0);
});

test('course', async (t) => {
  await api.getContent(loginUrl);

  const course = await api.getContent(courseUrl);

  t.is(course.status, 'success');
});

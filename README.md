# LMS Scraper

Scraper for IIITB LMS Client. This project is under active development and is not ready for production, just yet.

Scrapes [IIITB Moodle LMS](https://lms.iiitb.ac.in/moodle/login/index.php) and returns data as `json`. For use as API layer of IIITB LMS Client (yet to be built).  

Please note that the API is expected to change rapidly before a stable release.

## Get Started  

This is a reiteration of [LMS client](https://github.com/zeroby0/IIITB-LMS-Client-OLD) built in Java as a part of course curriculum last year. This NodeJS scraper is expected to be more performant than the last one.  

clone and install dependencies to get started.  
* `git clone https://github.com/zeroby0/lms-scraper`  
* `yarn` or `npm install`

If `yarn` fails with `Failed to execute 'node-gyp clean' (Error: spawn node-gyp ENOENT)`, install with `npm` first and use `yarn` from then on.  

> Note: Make sure you define your username and password in your environment. Either run `export LMS_USERNAME="Your Username"` and `export LMS_PASSWORD="Password"` in every terminal session before you run scraper or add them to your `bash_profile`.

## Documentation

All source is under `src` directory. Behaviour is expected to change as the project matures.

All settings can be changed by editing `config/default.yml`.

#### Index
* [Auth](#auth)
  * [isLoggedin](#isloggedin)
  * [login](#login)
  * [keepLoggedIn](#keeploggedin)
* [Course](#course)
  * [getForums](#getforums)
  * [getActivities](#getactivities)
  * [getMaterials](#getmaterials)
* [Course > Activity](#course--activity)
  * [getContent](#getcontent)
* [Course > Material](#course--material)
  * [getContent](#getcontent-1)
* [User](#user)
  * [isLoggedin](#isloggedin-1)
  * [login](#login-1)
  * [keepLoggedIn](#keeploggedin-1)
  * [getCourses](#getcourses)
  * [getPrivateFiles](#getprivatefiles)
  * [getCookies](#getcookies)
  * [setCookies](#setcookies)

> Note: Most functions expect a user-agent instance to be passed. Login with `User.login` before passing it to other functions. Most functions need the user to be logged in to work. `User.login` authorises and sets cookies on the user-agent. All functions return a promise.

### Auth
Authorisation functions. Not supposed to be used directly, login with `User.login` instead.
Returns user status from lms in json. Either `'You are not logged in.'` or `'You are logged in as <userID> <Full name> (Log   out)'`. Configuration options in `config/default.yaml` are in `eventFlags > auth > isLoggedin`.  
* #### isLoggedin
  ``` js
  static async isLoggedin(user-agent)
  ```
  Checks if a user is logged in.

  * ###### success
    promise resolves with
    ``` js
    { status: 'success', code: 0, data: '<status>' }
    ```  
  * ###### cannotConnect
    Network failed. Check your internet connection.
    ``` js
    { status: 'cannotConnect', code: 1}
    ```
  * ###### nullValue
    User status is null for an unknown reason.
    ``` js
    { status: 'nullValue', error: 2 }
    ```
  * ###### unknownError
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'Error', error: <Error>, code: 3 }
    ```
* #### login
  ``` js
  static async login(username, password, agent)
  ```

  Authorises user-agent and sets cookies. Returns `json` with cookies if _successfully logged in_.
  * ###### success
    Successfully logged in.  
    ``` js
    { status: 'authenticated', code: 0, cookies: <Cookies>, data: <User-Status> }
    ```
    
  * ###### invalidCreds  
    Invalid credentials supplied.  
    ``` js
    {status: 'invalidCredentials', code: 1}
    ```
  * ###### cannotConnect
    Network connectivity failed.  
    ``` js
    { status: 'cannotConnect', code: 3 }
    ```
  * ###### unknownError
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).   
    ``` js
    { status: 'Error', error: null, code: 4 }
    ```
* #### keepLoggedIn
  ``` js
  static async keepLoggedIn(username, password, agent, interval = 3000)
  ```
  Keeps user logged in by trying to login every few seconds. Default value is 3000 ms. You should use a higher value.  
  Calls `Auth.login` every `interval` seconds, doesn't return anything.  
  
  Uses recursion and `setTimeout` to keep looping. _Might_ cause a stack overflow if scraper is run continuously on a potato™    Micro controller.  

### Course
``` js
class Course
constructor(url)
```
`Course` class handles course level functions such as Forums, Course Materials and Activities. Getting their content is delegated to corresponding classes. For example, content _in Course Materials_ is handled by `Material` class in `src/Course/Material.js`. Constructor accepts course url. This is expected to change in future versions.  
* #### getForums
  ``` js
  async getForums(user-agent)
  ```
  Fetches list of Forums and links to them.

  * ###### success
    Succefully obtained list of forum names and links.
    ``` js
    { status: 'success', code: 0, link: [<forum-links>], name: [<Forum-name>] }
    ```
    The response is expected to change to be more consistent with others.  
  * ###### noForum
    Course has no forums.
    ``` js
    { status: 'noForum', code: 1 }
    ```
  * ###### cannotConnect
    Network connectivity failed.
    ``` js
    { status: 'cannotConnect', code: 2 }
    ```
  * ###### unknownError
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'Error', error: <Error>, code: 3 }
    ```
* #### getActivities
  ``` js
  async getActivities(user-agent)
  ```
  Fetches list of activities in course Activity section.
  * ###### success
    Successfully fetched list of activities from course.
    ``` js
    { status: 'success', code: 0, summary: <activity-section-summary>, \
    link: [<activity-links>], name: [<activity-name>], \
    desc: [<activity-description>] }
    ```
  * ###### noActivity
    No activity section in course.
    ``` js
    { status: 'noActivity', code: 1 }
    ```
  * ###### cannotConnect
    Network connectivity failed.
    ``` js
    { status: 'cannotConnect', code: 2 }
    ```
  * ###### unknownError
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'Error', code: 3, error: <Error> }
    ```
* #### getMaterials
  ``` js
  async getMaterials(user-agent)
  ```
  get course material name and links. This is usually named `slides folder` and `notes folder`.  
  
  * ###### success
    successfully fetched list of materials from course.
    ``` js
    { status: 'success', code: 0, summary: <material-section-summary>, link: [<material-links>], name: [<material-name>], desc: [<material-description>] }
    ```
  * ###### noMaterial
    No course material.
    ``` js
    { status: 'noMaterial', code: 1 }
    ```
  * ###### cannotConnect
    Network connectivity failed.
    ``` js
    { status: 'cannotConnect', code: 2 }
    ```
  * ###### unknownError
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'Error', code: 3, error: <Error> }
    ```
    
### Course > Activity
``` js
class Activity
constructor(url)
```
class `Activity` is in `src/Course/Activity.js`. Handles `Course Activity` level functions like fetching contents of an activity. Activity is usually an assignment. Submission details and feedback given can be obtained by using this class. Constructor expects an url to course activity. urls can be obtained from `Course.getActivities`.  

* #### getContent
  ``` js
  async getContent(user-agent)
  ```
  Get details of activity. This includes submission details and feedback. `submissionLeft` and `submissionRight` are arrays with content on left and rigth side of submission status in LMS. `feedbackLeft` and `feedbackRight` similary correspond to feedback section.  
  * ###### success
    ``` js
    { status: 'success', code: 0, title: <Activity-title>, intro: <Activity-intro>, \
    submissionLeft: [<left column of submission>], submissionRight: [<right column of submission>], \
    feedbackLeft: [<left column of feedback>], feedbackRight: [<right column of feedback>], \
    filesLink: <link to file submitted, if any>}
    ```
    Note that values to keys are empty if no such content exists.
  * ###### noContent
    ``` js
    { status: 'noContent', code: 1 }
    ```
    no content exists in activity. This shouldn't usually happen.
  * ###### cannotConnect
    Network connectivity failed.
    ``` js
    { status: 'cannotConnect', code: 2 }
    ```
  * ###### unknownError
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'Error', code: 3, error: <Error> }
    ```
### Course > Material
``` js
class Material
constructor(url)
```
Course Material. This is the content in what is usually `slides folder` or `notes folder`. Constructor expects url to course material, this can be obtained from `Course.getMaterial`. `Material` class is at `src/Course/Material.js`.  
* #### getContent
  ``` js
  async getContent(user-agent)
  ```
  Fetches name and links to contents in course material.  
  
  * ###### success
    successfully fetched contents.
    ``` js
    { status: 'success', code: 0, link: [<material-links>], name: [<material-name>] }
    ```
  * ###### noContent
    No content in course Material
    ``` js
    { status: 'noContent', code: 1 }
    ```
  * ###### cannotConnect
    Network failed.  
    ``` js
    { status: 'cannotConnect', code: 2 }
    ```
  * ###### unknownError
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'Error', code: 3, error: <Error> }
    ```
    
### User
``` js
class User extends Person
constructor(username, password)
```
User class that handles User level functions like authorisation  and gets courses and private files list. Apart from that, `User` extends `Person` and can set and get name, etc . Checkout `Person` in `src/User/Person.js`.  
* #### isLoggedin
  ``` js
  static async isLoggedin(user-agent)`
  ```
  Wrapper around `Auth.isLoggedin`. Checkout `Auth.isLoggedin` for more details.  
* #### login
  ```js
  async login(user-agent)
  ```
  Authorises user-agent with credentials of user. User credentials passed during _initialisation_ are used. Wraps around  `Auth.login`, checkout that section to see what Promises resolve or reject to.
* #### keepLoggedIn
  ```js
  async keepLoggedIn(user-agent)
  ```  
  wraps around `Auth.keepLoggedIn`. Uses `timeout` set in `config` file. You can set that at `params > onlineTimeout` in  `config/default.yaml` file.
* #### getCourses
  ```js
  static async getCourses(user-agent)
  ```
  Note that this is a `static` function. Assumes that user-agent is already authorised by passing to `User.login()`.
  * ###### success
    Successfully fetched list of courses. Note that this function assumes user credentials are correct. List of courses and links to them are returned in json.  
    ``` js
    { status: 'success', code: 0, data: [[<course-link>], [<course-name>] ] }
    ```
  * ###### error
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'error', code: 1, error: <Error> }
    ```
* #### getPrivateFiles
  ``` js
  static async getPrivateFiles(user-agent)
  ```
  Get user private files hosted in LMS. Note that this is a static function and assumes user-agent is authorised with correct credentials.  
  Results are identical to `User.getCourses`.
  * ###### success
    Successfully fetched private files.
    ``` js
    { status: 'success', code: 0, data: [[<files-link>], [<file-names>]] }
    ```
  * ###### error
    An unexpected error occurred. Please let me know along with details in [issues](https://github.com/zeroby0/lms-scraper/issues).
    ``` js
    { status: 'error', code: 1, error: <Error> }
    ```
* #### getCookies
  Get cookies from user-agent. Expects no arguments.
  ``` js
  getCookies()
  ```
  Retrieves cookies stored in `User` object.
* #### setCookies
  Fetches cookies from user agent and stores in User object.
  ``` js
  setCookies(user-agent)
  ```

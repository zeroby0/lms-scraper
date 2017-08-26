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

<hr>

## Documentation

Note: All settings can be changed by editing `config/default.yml`.

### Supported
* Login
* Courses and Private Files from home page
* List of Forums, Activities (Assignments), and Course Materials and link to, descriptions for them
* Activity (Assignment) details, submission and feedback recieved.
* Files uploaded in Course material section

### Limitations
* Forum content not supported right now.

### Usage
1. `Require` `index.js` from where you'd like to use the scraper. like so, `const API = require('./index')`.
2. API.getContent('your-url')
3. Get back JSON
4. ??
5. Profit!

API automatically resolves the URL and returns a `Promise` which resolves into JSON.  
Example:
``` js
api.getContent(url)
   .then((result) => {
     console.log(result)
   })
```
JSON responses are defined in `config/default.yml`. Here is the reference:
### General response
``` js
{
  context: '<context>',
  status: '<status>',
  code: '<error-code>',
  data: {
    data_single: '<data>',
    data_multiple: ['<data>']
  },
  error: '<Error if any>'
}
```

`context`: indicates the content of the response.  
`status`: indicates the status of the API call. `status` is `success` if everything went well.  
`code`: The error code. It is preferable to rely on `status` than  `code`.  
`data`: The data returned by the call.  
`url`: The url passed in call. Though URL is returned, it's not included in all responses. Errors for example. Do not rely on URL for identifying the response, maintain a record of call and response.   

### Login:
``` js
{  // Successful
    context:'login',
    status:'authenticated',
    code:0,
    data:{  
        status:'You are logged in as <Name and rollnumber> (Log out)',
        cookies:{  
            MoodleSession:'*&#%*#&%*&%*#~&$%*&'
        }
    }
}
```
``` js
inavlidCredentials: { context: 'login', status: 'invalidCredentials', code: 1 } // Invalid username or password
cannotConnect: { context: 'login', status: 'cannotConnect', code: 3 } // Network Unavailable
unknownError: { context: 'login', status: 'Error', error: '<error>', code: 4 } // an unexpected error occured
```
### Home
``` js
{  
    courseList:{  
        context:'courseList',
        status:'success',
        data:{  
            links:[Array],
            names:[Array]
        },
        code:0
    },
    privateFiles:{  
        context:'privateFiles',
        status:'success',
        data:{  
            links:[Array],
            names:[Array]
        },
        code:0
    }
}
```
``` js
cannotConnect: { context: 'home', status: 'cannotConnect', code: 1 } // Network unreachable
unknownError: { context: 'home', status: 'error', error: '<Error>', code: 2 } // An unexpected error occured
```
### Course
``` js
{  
    context:'course',
    status:'success',
    url: '<course-url>',
    data:{  
        forums:{  
            context:'forumList',
            status:'success',
            data:[  
                Object
            ],
            code:0
        },
        activities:{  
            context:'activityList',
            status:'success',
            data:[  
                Object
            ],
            code:0
        },
        materials:{  
            context:'materialList',
            status:'success',
            data:[  
                Object
            ],
            code:0
        }
    },
    code:0
}
```
``` js
cannotConnect: { context: 'course', status: 'cannotConnect', code: 1 } // No network

noForum: { context: 'forumList', status: 'noForum', code: 1 } // No forum for this course
noActivity: { context: 'activityList', status: 'noActivity', code: 1 } // No activities for this course
noMaterial: { context: 'materialList', status: 'noMaterial', code: 1 } // No materials for this course

unknownError: { context: 'course', status: 'Error', error: '<Error>', code: 2 } // An unexpected error occured
```
### Materials
``` js
{  
    context:'material',
    url:'<URL>',
    status:'success',
    code:0,
    data:{  
        links:[  
            '<List of links to course materials>'
        ],
        names:[  
            '<List of names in same order>'
        ]
    }
}
```
``` js
cannotConnect: { context: 'material', status: 'cannotConnect', code: 1 } // cannot connect to the internet
noContent: { context: 'material', status: 'noContent', code: 2 } // No content in this section
unknownError: { context: 'material', status: 'Error', error: '<Error>', code: 3 } // An unexpected error occured
```

### Activity
``` js
{  
    context:'activity',
    url:'<URL>',
    status:'success',
    code:0,
    data:{  
        intro:{  
            linkTitles:[Array],
            links:[Array],
            lists:[Array],
            text:'<Intro text>'
        },
        feedback:{  
            left:Array],
            right:[Array]
        },
        submission:{  
            left:[Array],
            right:[Array],
            filesLink:'<Link to subitted file>'
        }
    }
}
```
``` js
cannotConnect: { context: 'activity', status: 'cannotConnect', code: 1} // Network unreachable
noContent: { context: 'activity', status: 'noContent', code: 2} // No content in this section
unknownError: { context: 'activity', status: 'Error', error: '<Error>', code: 3 } // An unexpected error occured
```

### Malformed URL
``` js
unknownContext: { context: 'unknown', status: 'unknownContext', url: '<URL>', code: 1 }
```

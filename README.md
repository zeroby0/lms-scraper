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

One function call for anything. Call API.getContent() and it takes care of the rest.
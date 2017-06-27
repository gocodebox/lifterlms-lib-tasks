lifterlms-lib-tasks
===================

Gulp tasks and Node utilities for LifterLMS and LifterLMS add-on development


## Installation

`npm install --save-dev lifterlms-lib-tasks`

Create a `gulpfile` in the root of your project (`gulpfile.js`)

The file must contain, at a minimum:

```js
var gulp = require('gulp');

require( 'lifterlms-lib-tasks' )( gulp );
```

## Config File

Create a file named `.llmsconfig` in the root directory of your project

Example:

```json

{
  "pot": {
    "bugReport": "https://mybugreports.tld",
    "domain": "my-text-domain",
    "dest": "i18n/",
    "lastTranslator": "Jeffrey Lebowski <thedude@earthlink.com>",
    "team": "Team Name <team@myteam.com>",
    "package": "my-package-name",
  },
  "scripts": {
    "src": [ "assets/js/", "!assets/js/*.min.js" ],
    "dest": "assets/js/"
  }
}

```

## Tasks

+ `gulp pot` : Generates a `.pot` file in the configured destination directory (defaults to `i18n`)
+ `gulp scripts` : Minifies unminified scripts in the configured `scripts.src` glob via uglifyjs and saves them with a `.min` suffix in the `scripts.dest` directory

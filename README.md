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
    "jsClassname": "LLMS_SLUG_l10n",
    "jsFilename": "class-llms-slug-l10n.php",
    "jsSince": "1.0.0",
    "lastTranslator": "Jeffrey Lebowski <thedude@earthlink.com>",
    "team": "Team Name <team@myteam.com>",
    "package": "my-package-name",
  },
  "scripts": {
    "src": [ "assets/js/\*\*/\*.js", "!assets/js/\*\*/\*.min.js" ],
    "dest": "assets/js/"
  }
}

```

## Tasks

+ `gulp build` : Run textdomain, pot, scripts, and styles tasks.
+ `gulp pot` : Generates a `.pot` file in the configured destination directory (defaults to `i18n`)
+ `gulp scripts` : Minifies unminified scripts in the configured `scripts.src` glob via uglifyjs and saves them with a `.min` suffix in the `scripts.dest` directory
+ `gulp styles` : Compiles `.scss` files to `.css` (both minified and unminified) from the configured `styles.src` glob via gulp-sass and saves in the `styles.dest` directory.
+ `gulp textdomain` : Ensures all WP i18n functions have the text domain specified by `pot.domain`.
+ `gulp versioner -V X.X.X` : Replaces all instances of "@deprecated [version]", "@since [version]", & "@version [version]" with the supplied version number in specifed files. Uses `versioner.src` glob. If `versioner.scripts` is true, adds glob defined in `scripts.src`.
+ `gulp watch` : Watch all configured `src` directories for pot, scripts, and styles tasks and re-run them on change.

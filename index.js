module.exports = function( gulp ) {

  var fs = require( 'fs' )
    , merge = require( 'merge' )
    , package = require( process.cwd() + '/package.json' )
    , config
  ;

  config = {
    build: {
      custom: [],
    },
    pot: {
      bugReport: 'https://lifterlms.com/my-account/my-tickets',
      domain: package.name,
      dest: 'i18n/',
      jsClassname: 'LLMS_l10n',
      jsFilename: 'class-llms-l10n.php',
      jsSince: '1.0.0',
      jsSrc: [],
      lastTranslator: 'Thomas Patrick Levy <thomas@lifterlms.com>',
      team: 'LifterLMS <help@lifterlms.com>',
      package: package.name,
    },
    scripts: {
      dest: 'assets/js/',
      src: [ 'assets/js/**/*.js', '!assets/js/**/*.min.js' ],
      watch: [ 'assets/js/**/*.js', '!assets/js/**/*.min.js' ],
    },
    styles: {
      autoprefixer: 'last 2 versions',
      dest: 'assets/css/',
      src: [ 'assets/scss/**/*.scss', '!assets/scss/**/_*.scss' ],
      watch: [ 'assets/scss/**/*.scss' ],
    },
    versioner: {
      scripts: true,
      src: [ './*.php', './inc/**/*.php', './includes/**/*.php', './templates/**/*.php', './tests/*.php' ],
    }
  };

  if ( fs.existsSync( './.llmsconfig' ) ) {
    var file = JSON.parse( fs.readFileSync( './.llmsconfig', 'utf8' ) );
    config = merge.recursive( config, file );
  }

  if ( ! config.pot.jsSrc.length ) {
    config.pot.jsSrc = config.scripts.src;
  }

  require( __dirname + '/tasks/build' )( gulp, config );
  require( __dirname + '/tasks/pot' )( gulp, config );
  require( __dirname + '/tasks/pot:js' )( gulp, config );
  require( __dirname + '/tasks/scripts' )( gulp, config );
  require( __dirname + '/tasks/styles' )( gulp, config );
  require( __dirname + '/tasks/styles:rtl' )( gulp, config );
  require( __dirname + '/tasks/textdomain' )( gulp, config );
  require( __dirname + '/tasks/versioner' )( gulp, config );
  require( __dirname + '/tasks/watch' )( gulp, config );

};

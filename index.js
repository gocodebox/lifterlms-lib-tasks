module.exports = function( gulp ) {

  var fs = require( 'fs' )
    , merge = require( 'merge' )
    , package = require( '../../package.json' )
    , config
  ;

  config = {
    pot: {
      bugReport: 'https://lifterlms.com/my-account/my-tickets',
      domain: package.name,
      dest: 'i18n/',
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
      dest: 'assets/css/',
      src: [ 'assets/scss/**/*.scss', '!assets/scss/**/_*.scss' ],
      watch: [ 'assets/scss/**/*.scss' ],
    }
  };

  if ( fs.existsSync( './.llmsconfig' ) ) {
    var file = JSON.parse( fs.readFileSync( './.llmsconfig', 'utf8' ) );
    config = merge.recursive( config, file );
  }

  require( __dirname + '/tasks/build' )( gulp, config );
  require( __dirname + '/tasks/pot' )( gulp, config );
  require( __dirname + '/tasks/scripts' )( gulp, config );
  require( __dirname + '/tasks/styles' )( gulp, config );
  require( __dirname + '/tasks/watch' )( gulp, config );

};

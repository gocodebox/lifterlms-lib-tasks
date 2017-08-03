module.exports = function( gulp, config ) {

  var   replace = require( 'gulp-replace' )
      , argv    = require( 'yargs' ).argv
      , gutil   = require( 'gulp-util' )
  ;

  gulp.task( 'versioner', function() {

    var the_version = argv.V,
        glob = config.versioner.src;

    if ( config.versioner.scripts ) {
      glob = glob.concat( config.scripts.src );
    }

    if ( ! the_version ) {
      gutil.log( gutil.colors.red( 'Missing version number. Try `gulp versioner -V 9.9.9`' ) );
      return;
    }

    return gulp.src( glob, { base: './' } )
      .pipe( replace( /(\* @(since|version) +\[version\])/g, function( string ) {
        return string.replace( '[version]', the_version );
      } ) )
      .pipe( gulp.dest( './' ) );

  } );

};

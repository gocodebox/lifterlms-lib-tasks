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

    if ( config.versioner.main ) {
      gulp.src( config.versioner.main, { base: './' } )
        .pipe( replace( / \* Version: (\d+\.\d+\.\d+)/g, function( match, p1, offset, string ) {
          return match.replace( p1, the_version );
        } ) )
        .pipe( replace( / public \$version = '(\d+\.\d+\.\d+)';/g, function( match, p1, offset, string ) {
          return match.replace( p1, the_version );
        } ) )
        .pipe( gulp.dest( './' ) );
    }


    return gulp.src( glob, { base: './' } )
      .pipe( replace( /(\* @(since|version|deprecated) +\[version\])/g, function( string ) {
        return string.replace( '[version]', the_version );
      } ) )
      .pipe( gulp.dest( './' ) );

  } );

};

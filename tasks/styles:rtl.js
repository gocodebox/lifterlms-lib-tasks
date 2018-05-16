module.exports = function( gulp, config ) {

  var rename = require( 'gulp-rename' )
    , rtlcss = require( 'gulp-rtlcss' )
  ;

  gulp.task( 'styles:rtl', [ 'styles' ], function( cb ) {

    gulp.src( [ config.styles.dest + '**/*.css', '!' + config.styles.dest + '**/*-rtl*.css' ] )
      .pipe( rtlcss() )
      .pipe( rename( function( path ) {
        var suffix = '-rtl';
        if ( -1 !== path.basename.indexOf( '.min' ) ) {
          path.basename = path.basename.replace( '.min', suffix + '.min' );
        } else {
          path.basename += '-rtl';
        }
      } ) )
      .pipe( gulp.dest( config.styles.dest ) );

  } );

};

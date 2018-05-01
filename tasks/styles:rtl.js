module.exports = function( gulp, config ) {

  var rename = require( 'gulp-rename' )
    , rtlcss = require( 'gulp-rtlcss' )
  ;

  gulp.task( 'styles:rtl', [ 'styles' ], function( cb ) {

    gulp.src( [ config.styles.dest + '**/*.css', '!' + config.styles.dest + '**/*-rtl.css' ] )
      .pipe( rtlcss() )
      .pipe( rename( { suffix: '-rtl' } ) )
      .pipe( gulp.dest( config.styles.dest ) );

  } );

};

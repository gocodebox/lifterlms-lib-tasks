module.exports = function( gulp, config ) {

  var   pump = require( 'pump' )
    , rename = require( 'gulp-rename' )
    , uglify = require( 'gulp-uglify' )
  ;

  gulp.task( 'scripts', function( cb ) {
    pump( [

      gulp.src( config.scripts.src ),
        uglify(),
        rename( {
          suffix: '.min',
        } ),
        gulp.dest( config.scripts.dest )

    ] );

  } );

};

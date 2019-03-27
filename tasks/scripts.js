module.exports = function( gulp, config ) {

  const
      include = require( 'gulp-include' )
    ,    maps = require( 'gulp-sourcemaps' )
    ,    pump = require( 'pump' )
    ,  rename = require( 'gulp-rename' )
    ,  uglify = require( 'gulp-uglify' )
  ;

  gulp.task( 'scripts', function( cb ) {

    pump( [
      gulp.src( config.scripts.src ),
        maps.init(),
        include(),
        uglify(),
        rename( {
          suffix: '.min',
        } ),
        maps.write(),
        gulp.dest( config.scripts.dest )
      ],
      cb
    );

  } );

};

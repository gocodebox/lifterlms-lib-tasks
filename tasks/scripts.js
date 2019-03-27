module.exports = function( gulp, config ) {

  const
        babel = require( 'gulp-babel' )
    ,  gulpif = require( 'gulp-if' )
    , include = require( 'gulp-include' )
    ,    maps = require( 'gulp-sourcemaps' )
    ,    pump = require( 'pump' )
    ,  rename = require( 'gulp-rename' )
    ,  uglify = require( 'gulp-uglify' )
  ;

  gulp.task( 'scripts', function( cb ) {

    pump( [
      gulp.src( config.scripts.src ),
        maps.init(),
        gulpif( config.scripts.babel, babel() ),
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

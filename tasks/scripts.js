module.exports = function( gulp, config ) {

  const
       gulpif = require( 'gulp-if' )
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
        include( config.scripts.include ),
        gulpif( false !== config.scripts.dist, rename( {
          suffix: config.scripts.dist,
        } ) ),
        gulpif( false !== config.scripts.dist, gulp.dest( config.scripts.dest ) ),
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

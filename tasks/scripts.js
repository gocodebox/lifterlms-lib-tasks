module.exports = function( gulp, config ) {

  const
          gulpif = require( 'gulp-if' )
    , gulpignore = require( 'gulp-ignore' )
    ,    include = require( 'gulp-include' )
    ,       maps = require( 'gulp-sourcemaps' )
    ,       pump = require( 'pump' )
    ,     rename = require( 'gulp-rename' )
    ,     uglify = require( 'gulp-uglify' )
    ,       path = require( 'path' )
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

        // Don't pass maps any further.
        gulpignore.exclude( file => '.js' !== path.extname( file.basename ) ),

        uglify(),
        rename( {
          suffix: '.min',
        } ),
        maps.write( '../maps/js', { destPath: config.scripts.dest } ),
        gulp.dest( config.scripts.dest )
      ],
      cb
    );

  } );

};

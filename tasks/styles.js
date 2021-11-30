module.exports = function( gulp, config ) {

  var autoprefixer = require( 'gulp-autoprefixer' )
    ,   gulpignore = require( 'gulp-ignore' )
    ,         maps = require( 'gulp-sourcemaps' )
    ,         pump = require( 'pump' )
    ,       rename = require( 'gulp-rename' )
    ,         sass = require( 'gulp-sass' )( require( 'sass' ) )
    ,         path = require( 'path' )
  ;

  gulp.task( 'styles', function( cb ) {

    pump( [
      gulp.src( config.styles.src ),

        // Unminified.
        maps.init(),
        sass( {
          outputStyle: 'expanded',
        } ),
        autoprefixer( config.styles.autoprefixer ),
        maps.write( '../maps/css', { destPath: config.styles.dest } ),
        gulp.dest( config.styles.dest ),

        // Don't pass maps any further.
        gulpignore.exclude( file => '.css' !== path.extname( file.basename ) ),

        // Minified.
        sass( {
          outputStyle: 'compressed',
        } ),
        autoprefixer( config.styles.autoprefixer ),
        rename( {
          suffix: '.min',
        } ),
        maps.write( '../maps/css', { destPath: config.styles.dest } ),
        gulp.dest( config.styles.dest )
      ],

      cb
    );

  } );

};

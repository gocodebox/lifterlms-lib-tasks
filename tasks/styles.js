module.exports = function( gulp, config ) {

  var autoprefixer = require( 'gulp-autoprefixer' )
    ,       gulpif = require( 'gulp-if' )
    ,   gulpignore = require( 'gulp-ignore' )
    ,         maps = require( 'gulp-sourcemaps' )
    ,         pump = require( 'pump' )
    ,       rename = require( 'gulp-rename' )
    ,         sass = require( 'gulp-sass' )
    ,         path = require( 'path' )
  ;

  gulp.task( 'styles', function( cb ) {

    pump( [
      gulp.src( config.styles.src ),

        // unminified
        maps.init(),
        sass( {
          outputStyle: 'nested',
        } ),
        autoprefixer( config.styles.autoprefixer ),
        maps.write( '../maps', { includeContent: false, sourceRoot: '../sass/' } ),
        gulp.dest( config.styles.dest ),

        gulpignore.exclude( file => '.css' !== path.extname( file.basename ) ),

        // minify
        sass( {
          outputStyle: 'compressed',
        } ),
        autoprefixer( config.styles.autoprefixer ),
        rename( {
          suffix: '.min',
        } ),
        maps.write( '../maps', { includeContent: false, sourceRoot: '../sass/' } ),
        gulp.dest( config.styles.dest )
      ],

      cb
    );

  } );

};

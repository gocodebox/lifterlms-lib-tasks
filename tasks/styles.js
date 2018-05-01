module.exports = function( gulp, config ) {

  var autoprefixer = require( 'gulp-autoprefixer' )
    ,         maps = require( 'gulp-sourcemaps' )
    ,         pump = require( 'pump' )
    ,       rename = require( 'gulp-rename' )
    ,         sass = require( 'gulp-sass' )
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
        maps.write(),
        gulp.dest( config.styles.dest ),

        // minify
        maps.init(),
        sass( {
          outputStyle: 'compressed',
        } ),
        autoprefixer( config.styles.autoprefixer ),
        rename( {
          suffix: '.min',
        } ),
        maps.write(),
        gulp.dest( config.styles.dest )
      ],

      cb
    );

  } );

};

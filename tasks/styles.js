module.exports = function( gulp, config ) {

  var   maps = require( 'gulp-sourcemaps' )
    ,   pump = require( 'pump' )
    , rename = require( 'gulp-rename' )
    ,   sass = require( 'gulp-sass' )
  ;

  gulp.task( 'styles', function( cb ) {

    pump( [
      gulp.src( config.styles.src ),
        // unminified
        maps.init(),
        sass( {
          outputStyle: 'nested',
        } ),
        maps.write(),
        gulp.dest( config.styles.dest ),

        // minify
        maps.init(),
        sass( {
          outputStyle: 'compressed',
        } ),
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

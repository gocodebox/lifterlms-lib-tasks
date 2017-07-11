module.exports = function( gulp, config ) {

  var   maps = require( 'gulp-sourcemaps' )
    ,   pump = require( 'pump' )
    , rename = require( 'gulp-rename' )
    ,   sass = require( 'gulp-sass' )
  ;

  gulp.task( 'styles', function( cb ) {

    pump(
      // unminified
      [ gulp.src( config.styles.src ),
        sass( {
          outputStyle: 'nested',
        } ),
        gulp.dest( config.styles.dest ) ],

      // minify
      [ gulp.src( config.styles.src ),
        maps.init(),
        sass( {
          outputStyle: 'compressed',
        } ),
        rename( {
          suffix: '.min',
        } ),
        maps.write(),
        gulp.dest( config.styles.dest ) ],

      // callback
      cb

    );

  } );

};

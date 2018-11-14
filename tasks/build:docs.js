
module.exports = function( gulp, config ) {

  var metalsmith = require( 'gulp-metalsmith' )
      , markdown = require( 'metalsmith-markdown' )
  ;

  gulp.task( 'build:docs', gulp.series( 'hooks', function( cb ) {

    gulp.src( config.docs.src + '**' )
      .pipe( metalsmith( {
        root: __dirname,
        use: [
          markdown()
        ],
        json: [ config.docs.src + 'pages.json' ],
      } ) )
      .pipe( gulp.dest( config.docs.src ) );

    cb();

  } ) );

};

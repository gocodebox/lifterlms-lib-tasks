
module.exports = function( gulp, config ) {

  var metalsmith = require( 'gulp-metalsmith' )
      , markdown = require( 'metalsmith-markdown' )
      , layouts  = require( 'metalsmith-layouts' )
  ;

  gulp.task( 'build:docs', gulp.series( 'hooks', function( cb ) {

    gulp.src( config.docs.src + '**' )
      .pipe( metalsmith( {
        root: __dirname,
        use: [
          markdown(),
          layouts( {
            default: 'layout.hbs',
            engine: 'handlebars'
          } )
        ],
        json: [ config.docs.src + 'pages.json' ],
      } ) )
      .pipe( gulp.dest( config.docs.src ) );

    cb();

  } ) );

};

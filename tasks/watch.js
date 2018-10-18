module.exports = function( gulp, config ) {

  gulp.task( 'watch', function() {

    if ( config.watch.custom.length ) {

      config.watch.custom.forEach( function( obj ) {

        gulp.watch( obj.glob, gulp.parallel( ...obj.tasks ) );

      } );

    }

    gulp.watch( [ '*.php', './**/*.php', '!vendor/*', '!./**/' + config.pot.jsFilename ], gulp.parallel( 'textdomain' ) );
    gulp.watch( config.scripts.watch, gulp.parallel( 'scripts' ) );
    gulp.watch( config.styles.watch, gulp.parallel( 'styles' ) );

  } );

};


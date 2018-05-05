module.exports = function( gulp, config ) {

  gulp.task( 'watch', function() {

    if ( config.watch.custom.length ) {

      config.watch.custom.forEach( function( obj ) {

        gulp.watch( obj.glob, obj.tasks );

      } );

    }

    gulp.watch( [ '*.php', './**/*.php', '!vendor/*', '!./**/' + config.pot.jsFilename ], [ 'textdomain' ] );
    gulp.watch( config.scripts.watch, [ 'scripts' ] );
    gulp.watch( config.styles.watch, [ 'styles' ] );

  } );

};


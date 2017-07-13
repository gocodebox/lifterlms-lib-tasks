module.exports = function( gulp, config ) {

  gulp.task( 'watch', function() {

    gulp.watch( [ '*.php', './**/*.php', '!vendor/*' ], [ 'pot' ] );
    gulp.watch( config.scripts.src_watch, [ 'scripts' ] );
    gulp.watch( config.styles.src_watch, [ 'styles' ] );

  } );

};


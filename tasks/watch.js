module.exports = function( gulp, config ) {

  gulp.task( 'watch', function() {

    gulp.watch( [ '*.php', './**/*.php', '!vendor/*' ], [ 'textdomain', 'pot' ] );
    gulp.watch( config.scripts.watch, [ 'scripts' ] );
    gulp.watch( config.styles.watch, [ 'styles' ] );

  } );

};


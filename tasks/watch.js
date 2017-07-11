module.exports = function( gulp, config ) {

  gulp.task( 'watch', function() {

    gulp.watch( [ '*.php', './**/*.php', '!vendor/*' ], [ 'pot' ] );
    gulp.watch( config.scripts.src, [ 'scripts' ] );
    gulp.watch( config.styles.src, [ 'styles' ] );

  } );

};


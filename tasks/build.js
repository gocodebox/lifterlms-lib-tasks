module.exports = function( gulp, config ) {

  gulp.task( 'build', [ 'textdomain', 'pot', 'scripts', 'styles:rtl' ] );

};


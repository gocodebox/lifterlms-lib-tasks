module.exports = function( gulp, config ) {

  var tasks = [ 'textdomain', 'pot', 'scripts', 'styles', 'styles:rtl' ].concat( config.build.custom );

  gulp.task( 'build', gulp.series( ...tasks ) );

};


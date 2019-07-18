module.exports = function( gulp, config ) {

  var   sort  = require( 'gulp-sort' )
    , wpPot = require( 'gulp-wp-pot' )
  ;

  gulp.task( 'pot', gulp.series( 'pot-js', 'pot-php' ) );

};

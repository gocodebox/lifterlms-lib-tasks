/**
 * WIP
 */
module.exports = function( gulp, config ) {

  var   replace = require( 'gulp-replace' )
      , fs      = require( 'fs' )
  ;

  gulp.task( 'hooks', function() {

    return gulp.src( config.docs.hooks.src, { base: './' } )
      .pipe( replace( /(apply_filters|do_action)\((.*)\)/g, function( match, hook_type, content, offset, string ) {

        console.log( content );

        return match;
      } ) )
      .pipe( gulp.dest( './tmp/hooks.txt' ) );

  } );

};

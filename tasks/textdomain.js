module.exports = function( gulp, config ) {

  var checkTextDomain = require( 'gulp-checktextdomain' )
  ;

  gulp.task( 'textdomain', function() {

    gulp.src( [ '*.php', './**/*.php', '!vendor/*' ] )

      .pipe( checkTextDomain( {
        text_domain: config.pot.domain,
        keywords: [
          '__:1,2d',
          '_e:1,2d',
          '_x:1,2c,3d',
          'esc_html__:1,2d',
          'esc_html_e:1,2d',
          'esc_html_x:1,2c,3d',
          'esc_attr__:1,2d',
          'esc_attr_e:1,2d',
          'esc_attr_x:1,2c,3d',
          '_ex:1,2c,3d',
          '_n:1,2,4d',
          '_nx:1,2,4c,5d',
          '_n_noop:1,2,3d',
          '_nx_noop:1,2,3c,4d'
         ],
      } ) )

  } );

};

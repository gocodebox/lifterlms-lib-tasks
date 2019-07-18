module.exports = function( gulp, config ) {

  var   sort  = require( 'gulp-sort' )
    , wpPot = require( 'gulp-wp-pot' )
  ;

  gulp.task( 'pot-php', function( cb ) {

    gulp.src( config.pot.phpSrc )

      .pipe( sort() )

      .pipe( wpPot( {
        bugReport: config.pot.bugReport,
        domain: config.pot.domain,
        package: config.pot.package,
        lastTranslator: config.pot.lastTranslator,
        team: config.pot.team,
      } ) )

      .pipe( gulp.dest( config.pot.dest + config.pot.domain + '.pot' ) );

      cb();

  } );

};

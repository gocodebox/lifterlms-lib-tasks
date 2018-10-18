module.exports = function( gulp, config ) {

  var   replace = require( 'gulp-replace' )
      , argv    = require( 'yargs' ).argv
      ,  filter = require( 'gulp-filter' )
      , fs      = require( 'fs' )
      , gutil   = require( 'gulp-util' )
      , run     = require( 'gulp-run' )
  ;

  gulp.task( 'versioner', gulp.series( ...config.versioner.custom ), function( cb ) {

    var the_version = argv.V,
        glob = config.versioner.src;

    // include JS files if configured to do so
    if ( config.versioner.scripts ) {
      glob = glob.concat( config.scripts.src );
    }

    if ( ! the_version ) {
      gutil.log( gutil.colors.red( 'Missing version number. Try `gulp versioner -V 9.9.9`' ) );
      return;
    }

    if ( true !== argv.skip_package ) {
      // updates the package file
      run( 'npm version --no-git-tag-version ' + the_version ).exec();
    }

    var main_glob = config.versioner.main ? [ config.versioner.main ] : [ '**' ],
        main_filter = filter( main_glob, { restore: true } );

    return gulp.src( glob, { base: './' } )
      // version all applicable files
      .pipe( replace( /(\* @(since|version|deprecated) +\[version\])/g, function( string ) {
        return string.replace( '[version]', the_version );
      } ) )
      // filter to the main plugin file & perform more replacements there
      .pipe( main_filter )
      .pipe( replace( / \* Version: (\d+\.\d+\.\d+)(\-\D+\.\d+)?/g, function( match, p1, p2, string ) {
        // if there's a prerelease suffix (eg -beta.1) remove it entirely
        if ( p2 ) {
          match = match.replace( p2, '' );
        }
        return match.replace( p1, the_version );
      } ) )
      .pipe( replace( /public \$version = '(\d+\.\d+\.\d+)(\-\D+\.\d+)?';/g, function( match, p1, p2, string ) {
        // if there's a prerelease suffix (eg -beta.1) remove it entirely
        if ( p2 ) {
          match = match.replace( p2, '' );
        }
        return match.replace( p1, the_version );
      } ) )
      // restore all files filtered out
      .pipe( main_filter.restore )
      .pipe( gulp.dest( './' ) );

    cb();

  } );

};

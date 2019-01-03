module.exports = function( gulp, config ) {

  const replace = require( 'gulp-replace' ),
        argv = require( 'yargs' ).argv,
        filter = require( 'gulp-filter' ),
        fs = require( 'fs' ),
        gutil = require( 'gulp-util' ),
        run = require( 'gulp-run' ),
        getVersion = require( '../lib/getVersion' );

  gulp.task( '_versioner', function( cb ) {

    let the_version = argv.V,
        glob = config.versioner.src;

    the_version = getVersion( the_version, config._package.version );

    gutil.log( gutil.colors.blue( 'Updating version to `' + the_version + '`' ) );

    // include JS files if configured to do so
    if ( config.versioner.scripts ) {
      glob = glob.concat( config.scripts.src );
    }

    // Update the package file unless explicitly skipping or the version is equal to the current pacakage version.
    if ( the_version !== config._package.version && true !== argv.skip_package ) {
      // updates the package file.
      run( 'npm version --no-git-tag-version ' + the_version, { silent: true } ).exec();
    }

    var main_glob = [ '**' ];

    if ( config.versioner.main ) {
      if ( 'string' === typeof config.versioner.main ) {
        main_glob = [ config.versioner.main ];
      } else {
        main_glob = config.versioner.main;
      }
    }

    var main_filter = filter( main_glob, { restore: true } );

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

  var tasks = config.versioner.custom.push( '_versioner' );
  gulp.task( 'versioner', gulp.series( ...config.versioner.custom ) );

};

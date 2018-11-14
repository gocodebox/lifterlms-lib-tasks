module.exports = function( gulp, config, args ) {

  var  composer = require( 'gulp-composer' )
     ,   rename = require( 'gulp-rename' )
     ,      zip = require( 'gulp-vinyl-zip' )
  ;

  gulp.task( 'zip', function( cb ) {

    var build_src = config.zip.src.default.contact( '!' + config.docs.src ).concat( config.zip.src.custom );

    // if configured, run composer to install only prod. deps.
    if ( config.zip.composer ) {
      composer( 'install --no-dev --no-scripts', { async: false } );
    // if not configured, exclude composer from the build
    } else {
      build_src = build_src.concat( '!./vendor/**' );
    }

    return gulp.src( build_src )
      // add the src to an unsuffixed directory (eg: lifterlms/)
      .pipe( rename( function( path ) {
        path.dirname = config.zip.name + '/' + path.dirname;
      } ) )
      // zip it up
      .pipe( zip.zip( config.zip.name + '.zip' ) )
      // rename the zip to have the version suffix (if applicable)
      .pipe( rename( function( path ) {
        if ( args.V ) {
          path.basename += '-' + args.V;
        }
      } ) )
      // save in the dest dir
      .pipe( gulp.dest( config.zip.dest ) )
      // reinstall composer with dev. deps. & runs scripts
      .on( 'end', function() {
        if ( config.zip.composer ) {
          composer( 'install', { async: false } )
        }
      } );

    cb();

  } );

};

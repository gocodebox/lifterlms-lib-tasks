module.exports = function( gulp, config, args ) {

  var  composer = require( 'gulp-composer' )
     ,   rename = require( 'gulp-rename' )
     ,      zip = require( 'gulp-vinyl-zip' )
  ;

  gulp.task( 'zip', function() {

    // if configured, run composer to install only prod. deps.
    if ( config.zip.composer ) {
      composer( 'install --no-dev --no-scripts', { async: false } );
    }

    return gulp.src( config.zip.src.default.concat( config.zip.src.custom ) )
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

  } );

};
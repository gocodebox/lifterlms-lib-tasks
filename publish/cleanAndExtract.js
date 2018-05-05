module.exports = function( gulp, config, version, tmpdir, cb ) {

  var     fs = require( 'fs' )
    , globby = require( 'globby' )
    , rename = require( 'gulp-rename' )
    , rimraf = require( 'rimraf' )
    ,    zip = require( 'gulp-vinyl-zip' )
  ;

  var zip_name = config.zip.name + '-' + version + '.zip';

  // clean the entire branch leaving only the git dir (it'll be empty when we're done hahaha)
  globby( [ tmpdir + '*', '!' + tmpdir + '.git' ], { dot: true, onlyFiles: false } ).then( function ( paths ) {
    paths.map( function( item ) {
      rimraf.sync( item );
    } );

    if ( ! fs.existsSync( config.zip.dest + zip_name ) ) {
      return cb( 'Distrubtion zip file: "' + config.zip.dest + zip_name + '" not found. Try running `gulp dist -V ' + version + '` first.' );
    }

    // unzip the dist zip
    zip.src( config.zip.dest + zip_name )
      // modify the path to exclude the package directory in the dist zip (eg remove "lifterlms/")
      .pipe( rename( function( path ) {
        if ( 0 === path.dirname.indexOf( config.zip.name + '/' ) ) {
          path.dirname = path.dirname.replace( config.zip.name + '/', '' );
        } else if ( config.zip.name === path.dirname ) {
          path.dirname = path.dirname.replace( config.zip.name, '' );
        }
      } ) )
      // move it into the tmp dir
      .pipe( gulp.dest( tmpdir ) )

      // finished
      .on( 'end', cb );

  } );

}

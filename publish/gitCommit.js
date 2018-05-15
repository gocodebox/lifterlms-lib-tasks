module.exports = function( gulp, config, version, cb ) {

  var     fs = require( 'fs' )
    , cleanAndExtract = require( './cleanAndExtract' )
    ,    git = require( 'gulp-git' )
    , globby = require( 'globby' )
    , rename = require( 'gulp-rename' )
    , rimraf = require( 'rimraf' )
    ,    zip = require( 'gulp-vinyl-zip' )
  ;

  var tmpdir = './tmp/git/';

  // clean tmp directory
  rimraf.sync( tmpdir );

  // clone the repo into tmp dir
  git.clone( config.publish.github.url, { args: tmpdir }, function( err ) {
    if ( err ) { return cb( err ); }

    // checkout to a new branch
    git.checkout( config.publish.github.branch, { args: '-b', cwd: tmpdir }, function ( err ) {
      if ( err ) { return cb( err ); }

      cleanAndExtract( gulp, config, version, tmpdir, function( err ) {
        if ( err ) { return cb( err ); }

        // git.status( { cwd: tmpdir } );

        // glob it up in a gulp stream
        return gulp.src( tmpdir + '.' )
          // add it all
          .pipe( git.add( { args: '--all', cwd: tmpdir } ) )
          // commit it all
          .pipe( git.commit( 'Deploy v' + version, { cwd: tmpdir } ) )
          .on( 'end', function() {

            // git.status( { cwd: tmpdir } );

            // force push
            git.push( 'origin', config.publish.github.branch, { args: '-f', cwd: tmpdir }, function ( err ) {
              if ( err ) { return cb( err ); }
              cb( null );

            } );

          } );

      } );

    } );

  } );

}

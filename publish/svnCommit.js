module.exports = function( gulp, config, version, auth, cb ) {

  var     fs = require( 'fs' )
    , cleanAndExtract = require( './cleanAndExtract' )
    , globby = require( 'globby' )
    , rimraf = require( 'rimraf' )
    ,    run = require( 'gulp-run' )
    ,    svn = require( 'node-svn-ultimate' )
  ;

  var tmpdir = './tmp/svn/',
      url = config.publish.svn.base + config.publish.svn.slug + '/';

  // clean tmp directory
  rimraf.sync( tmpdir );

  svn.commands.checkout( url, tmpdir, { depth: 'immediates' }, function( err ) {
    if ( err ) { return cb( err ); }

    svn.commands.checkout( url + 'trunk', tmpdir + 'trunk', { depth: 'infinity' }, function( err ) {
      if ( err ) { return cb( err ); }

      svn.commands.mkdir( tmpdir + 'tags/' + version, function( err ) {
        if ( err ) { return cb( err ); }

        cleanAndExtract( gulp, config, version, tmpdir + 'tags/' + version, function( err ) {
          if ( err ) { return cb( err ); }

          fs.createReadStream( 'readme.txt' ).pipe( fs.createWriteStream( tmpdir + 'trunk/readme.txt' ) );

          svn.commands.add( tmpdir + '*', { force: true }, function( err ) {

            if ( err ) { return cb( err ); }

              var opts = {
                params: [ '-m "Deploy v' + version + '"' ],
                username: auth.svn_user,
                password: '"' + auth.svn_pass + '"',
              };

              svn.commands.commit( tmpdir, opts, function( err ) {
                if ( err ) { return cb( err ); }
                return cb( null );
              } );

          } );

        } );

      } );

    } );

  } );

}

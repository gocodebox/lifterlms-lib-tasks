module.exports = function( gulp, config, version, auth, cb ) {

  var     fs = require( 'fs' )
    , cleanAndExtract = require( './cleanAndExtract' )
    , globby = require( 'globby' )
    ,  merge = require( 'merge' )
    , rimraf = require( 'rimraf' )
    ,    svn = require( 'node-svn-ultimate' )
  ;

  var tmpdir = './tmp/svn/',
      url = config.publish.svn.base + config.publish.svn.slug + '/',
      // branch_name = 'deploy-' + version,
      auth_opts = {
        username: auth.svn_user,
        password: '"' + auth.svn_pass + '"',
      };

  // clean tmp directory
  rimraf.sync( tmpdir );

  svn.commands.checkout( url, tmpdir, { depth: 'immediates' }, function( err ) {
    if ( err ) { return cb( err ); }

    svn.commands.checkout( url + 'trunk', tmpdir + 'trunk', { depth: 'infinity' }, function( err ) {
      if ( err ) { return cb( err ); }

      cleanAndExtract( gulp, config, version, tmpdir + 'trunk', function( err ) {
          if ( err ) { return cb( err ); }

          svn.commands.copy( tmpdir + 'trunk', tmpdir + 'tags/' + version, function( err ) {
            if ( err ) { return cb( err ); }

          } );

      } );

    } );

  } );

}

module.exports = function( version, pkg_version ) {

  const semver = require( 'semver' ),
        versions = [ 'major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease' ];

  // if no version supplied, use the current package version.
  if ( ! version ) {

    version = pkg_version;

  // if a increment string is supplied, increment the current package version accordingly.
  } else if ( -1 !== versions.indexOf( version ) ) {

    version = semver.inc( pkg_version, version );

  }

  return version;

};


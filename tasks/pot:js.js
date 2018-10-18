module.exports = function( gulp, config ) {

  var      fs = require( 'fs' ),
         glob = require( 'glob' ),
      compare = require( 'node-version-compare' )
    ;

  gulp.task( 'pot:js', function( cb ) {

      if ( ! config.pot.js ) {
        return;
      }

      var obj = {},
          counter = 0;
          package = config.docs.package + '/Classes/Localization',
          patterns = config.pot.jsSrc,
          fileversion = '0.0.0';

      patterns.forEach( function ( pattern ) {

          var files = glob.sync( pattern );

          files.forEach( function( file ) {

              var data = fs.readFileSync( process.cwd() + '/' + file ),
                  regex = /(?:LLMS\.l10n\.(?:translate|replace))\( '([^'\\]*(?:\\.[^'\\]*)*)'/g,
                  strings = [],
                  matches;

              while ( matches = regex.exec( data ) ) {
                  strings.push( matches[1] );
              }

              if ( strings.length ) {

                  var since = /[ \t\/*#@]*@since(?:\s*)(.*)/g,
                      version = /[ \t\/*#@]*@version(?:\s*)(.*)/g
                      since_matches = since.exec( data )
                      version_matches = version.exec( data );

                  obj[ file ] = {
                      since: since_matches ? since_matches[1] : '[version]',
                      version: version_matches ? version_matches[1] : '[version]',
                      strings: [],
                  };

                  if ( '[version]' === obj[ file ].version || '[version]' === fileversion ) {
                    fileversion = '[version]';
                  } else if ( 1 === compare( obj[ file ].version, fileversion ) ) {
                    fileversion = obj[ file ].version;
                  }

                  // remove dupes
                  strings.forEach( function( string, index ) {

                      if ( -1 === obj[ file ].strings.indexOf( string ) ) {
                          counter++;
                          obj[ file ].strings.push( string );
                      }

                  } );

              }

          } );

      } );

      var template = fs.readFileSync( __dirname + '/../templates/js-l10n-class.template' ).toString(),
          strings = '',
          data = '';

      for ( file in obj ) {

          strings += '\n\
\t\t\t/**\n\
\t\t\t * file: ' + file + '\n\
\t\t\t * @since    ' + obj[file].since +'\n\
\t\t\t * @version  ' + obj[file].version +'\n\
\t\t\t */\n\
';
          obj[file].strings.forEach( function( string ) {
              strings += "\t\t\t'" + string + "' => esc_html__( '" + string + "', '" + config.pot.domain + "' ),\n"
          } );

      };

      data = template.replace( /{{ classname }}/g, config.pot.jsClassname );
      data = data.replace( /{{ package }}/g, package );
      data = data.replace( /{{ fileversion }}/g, fileversion );
      data = data.replace( /{{ filesince }}/g, config.pot.jsSince );
      data = data.replace( /{{ strings }}/g, strings );

      fs.writeFile( './includes/' + config.pot.jsFilename, data, function( err ) {

          if ( err ) {
              console.error( err );
          }

          console.log( 'jspot completed and found ' + counter + ' strings' );

      } );

    cb();

  } );

};




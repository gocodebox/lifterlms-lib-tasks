module.exports = function( gulp, config ) {

  var   replace   = require( 'gulp-replace' )
      , tap       = require( 'gulp-tap' )
      , newFile   = require( 'gulp-file' )
      , columnify = require( 'columnify' )
  ;

  function parseHook( hook ) {

    var parsed = {
      hook: '',
      summary: '',
      description: '',
      since: '',
      version: '',
      example: '',
      params: [],
    };

    hook.forEach( function( line, index ) {

      if ( 0 === line.indexOf( 'Filter:' ) ) {
        parsed.hook = line.replace( 'Filter:', '' ).trim();
      } else if ( 0 === line.indexOf( 'Action:' ) ) {
        parsed.hook = line.replace( 'Action:', '' ).trim();
      } else if ( 0 === line.indexOf( '@since' ) ) {
        parsed.since = line.replace( '@since', '' ).trim();
      } else if ( 0 === line.indexOf( '@version' ) ) {
        parsed.version = line.replace( '@version', '' ).trim();
      } else if ( 0 === line.indexOf( '@example' ) ) {
        parsed.example = line.replace( '@example', '' ).trim();
      } else if ( 0 === line.indexOf( '@param' ) ) {
        line = line.replace( '@param', '' ).trim();
        var param = {
          type: line.split( /([a-zA-z|]+)\s/ )[1],
          var: '$' + line.split( /\$([a-zA-z]+)\s/ )[1],
        }
        param.desc = line.replace( param.type, '' ).replace( param.var, '' ).trim() + '  ';
        param.type = '`' + param.type + '`';
        param.var = '`' + param.var + '`';
        parsed.params.push( param );
      } else if ( 1 === index ) {
        parsed.summary = line;
      } else if ( 2 === index ) {
        parsed.description = line;
      }

    } );

    return parsed;

  }

  function createHookDocs( hook ) {

    var parsed = parseHook( hook ),
        doc = '';

    doc += '### ' + parsed.hook + '\r\n\r\n';
    doc += parsed.summary + '\r\n';
    if ( parsed.description ) {
      doc += parsed.description + '\r\n';
    }
    doc += '\r\n';

    doc += columnify( {
      '**Since**': parsed.since + '<br>',
      '**Version**': parsed.version + '<br>',
    }, { showHeaders: false } );

    if ( parsed.example ) {
      doc += '\r\n\r\n**Example** ';
      // Example is a link to a gist or something.
      if ( -1 !== parsed.example.indexOf( '://' ) ) {
        doc += '[' + parsed.example + '](' + parsed.example + ')';
      // doc is a code snippet.
      } else {
        doc += '`' + parsed.example + '`';
      }
    }

    if ( parsed.params.length ) {
      doc += '\r\n\r\n';
      doc += '**Parameters**  \r\n';
      doc += columnify( parsed.params, { showHeaders: false } )
    }

    return doc;

  }


  gulp.task( 'hooks', function( cb ) {

    var hooks = {
      filters: [],
      actions: [],
    };

    return gulp.src( config.docs.hooks.src, { base: './' } )

      .pipe( replace( /\/\*{2}([\s\S]+?)\*\//g, function( match, content, offset, string ) {

        content = content.replace( new RegExp( '\n', 'g'), '' ).replace( new RegExp( '\t', 'g'), '' );
        var lines = content.split( '* ' ).map( function( line ) {
          return line.trim();
        } ).filter( function( line ) {
          return ( line );
        } );

        if ( lines.length && -1 !== lines[0].indexOf( 'Filter:' ) ) {
          hooks.filters.push( createHookDocs( lines ) );
        } else if ( lines.length && -1 !== lines[0].indexOf( 'Action:' ) ) {
          hooks.actions.push( createHookDocs( lines ) );
        }

        return match;

      } ) )
      .pipe( tap( function( file ) {

        var title = config.package_name + ' Hooks Reference';

        var underline = '='.repeat( title.length );

        var content = title + '\r\n' + underline + '\r\n\r\n';
        content += 'Actions\r\n-------\r\n\r\n';
        content += hooks.actions.join( '\r\n\r\n\r\n' );
        content += '\r\n\r\n\r\n';
        content += 'Filters\r\n-------\r\n\r\n';
        content += hooks.filters.join( '\r\n\r\n\r\n' );

        return newFile( config.docs.hooks.filename, content )
          .pipe( gulp.dest( config.docs.src ) );
      } ) );

  } );

};

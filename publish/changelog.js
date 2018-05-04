function changelog() {

  var        fs = require( 'fs' )
    ,  showdown = require( 'showdown' )
    ,   raw_log = fs.readFileSync( './CHANGELOG.md', 'utf-8' );


  this.createHtmlFile = function( config, cb ) {

    var converter =  new showdown.Converter( {
          completeHTMLDocument: true,
          metadata: true,
        } ),
        template = fs.readFileSync( __dirname + '/../templates/changelog.template', 'utf-8' ).toString(),
        css = fs.readFileSync( __dirname + '/../node_modules/normalize.css/normalize.css', 'utf-8' ),
        html = converter.makeHtml( raw_log );

        template = template.replace( /{{ title }}/g, config.publish.title + ' Changelog' );
        template = template.replace( /{{ body }}/g, html );
        template = template.replace( /{{ css }}/g, css );

    return fs.writeFile( './tmp/changelog.html', template, cb );

  }

  this.getDistNotes = function ( cb ) {

    var notes = raw_log,
        i = 1,
        counter = 0,
        stop;

    // strip first 3 lines (title & spacing)
    while ( i <= 3 ) {
      notes = notes.substring( notes.indexOf( "\n" ) + 1 );
      i++;
    }

    // get the first item in the log
    notes = notes.replace( /v\d+\.\d+\.\d+ - \d{4}\-\d{2}\-\d{2}/g, function( match ) {
      if ( 1 === counter ) {
        stop = match;
      }
      counter++;
      return match;
    } );

    // remove everything except first item
    notes = notes.substring( 0, notes.indexOf( stop ) - 5 );

    // return it
    return cb( notes );

  }

  return this;

}

module.exports = new changelog();


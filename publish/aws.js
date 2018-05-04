module.exports = function( auth, file, name, cb ) {

  var  AWS = require( 'aws-sdk' )
    ,   fs = require( 'fs' )
    , path = require( 'path' )
  ;

  AWS.config.update( {
    accessKeyId: auth.aws_id,
    secretAccessKey: auth.aws_secret,
  } );

  var s3 = new AWS.S3();

  var stream = fs.createReadStream( file );
  stream.on( 'error', function ( err ) {
    if ( err ) { return cb( err ); }
  } );

  var content_type = null;
  switch ( path.extname( file ) ) {
    case '.html':
      content_type = 'text/html';
    break;
    case '.md':
      content_type = 'text/x-markdown';
    break;
    case '.zip':
      content_type = 'application/zip';
    break;
  }

  stream.on( 'open', function() {
    s3.upload( {
      ACL: 'public-read',
      Body: stream,
      Bucket: auth.aws_bucket,
      CacheControl: 'max-age=3600, no-transform, public',
      ContentType: content_type,
      Key: name,
    }, function( err, data ) {
      if ( err ) {
        return cb( err );
      }
      return cb( null, data );
    } );
  } );


}

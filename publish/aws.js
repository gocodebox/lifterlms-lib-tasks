module.exports = function( auth, file, name, privacy, cb ) {

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

  var content_type = null,
      max_age = 3600; // 1 hour

  switch ( path.extname( file ) ) {
    case '.html':
      content_type = 'text/html';
    break;
    case '.md':
      content_type = 'text/x-markdown';
    break;
    case '.zip':
      content_type = 'application/zip';
      max_age = 86400; // 24 hours
    break;
  }

  stream.on( 'open', function() {

    var acl = 'private',
        cache_control = [ 'max-age=' + max_age, 'no-transform' ];

    if ( 'public' === privacy ) {
      acl = 'public-read';
      cache_control.push( 'public' );
    } else {
      cache_control.push( 'private' );
    }

    s3.upload( {
      ACL: acl,
      Body: stream,
      Bucket: auth.aws_bucket,
      CacheControl: cache_control.join( ', ' ),
      ContentType: content_type,
      Key: name,
    }, function( err, data ) {
      if ( err ) {
        return cb( err );
      }

      if ( 'private' === privacy ) {

        data.dl_url = s3.getSignedUrl( 'getObject', {
          Bucket: auth.aws_bucket,
          Key: data.Key,
          Expires: 86400 * 2, // 48 hours
        } );
        return cb( null, data );

      } else {

        data.dl_url = data.Location;
        return cb( null, data );

      }

    } );
  } );


}

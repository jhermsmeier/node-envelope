var mime = require( 'mime-lib' )
var Iconv = require( 'iconv-lite' )

function Body( header, body, envelope ) {

  var boundary = header.contentType &&
    header.contentType.boundary

  if( boundary ) {

    var start = body.indexOf( '--' + boundary + '\r\n' )
    var end   = body.lastIndexOf( '--' + boundary + '--' )

    if( ~start ) {

      var parts = body
        .slice( start + boundary.length + 4, end )
        .split( '--' + boundary + '\r\n' )

      for( var i = 0; i < parts.length; i++ ) {
        this[i] = require('../envelope')( parts[i] )
      }

    } else {
      boundary = null
    }

  }

  if( !boundary ) {

    var isText = header.contentType &&
      header.contentType.mime &&
      ~header.contentType.mime.indexOf( 'text' )

    this[0] = body.trim()

    // Automatically create a buffer from
    // non-text base64 encoded data
    if( !isText && header.contentTransferEncoding === 'base64' ) {
      this[0] = new Buffer( this[0], 'base64' )
    }

    // Try to convert to UTF8, if it's not UTF8 yet
    var charset = header.contentType &&
      header.contentType.charset

    // Automatically decode text from either
    // base64 or quoted-printable encoding
    if( isText ) {
      if( header.contentTransferEncoding.toLowerCase() === 'quoted-printable' )
        this[0] = mime.decodeQP( this[0], charset )
      if( header.contentTransferEncoding === 'base64' )
        this[0] = new Buffer( this[0], 'base64' ).toString()
    }

    if( !isText && charset ) {
      if( Iconv.encodingExists( charset ) ) {
        this[0] = Iconv.decode( this[0], charset )
      }
    }

    // Convert this part to an Envelope,
    // if this part appears to be an attached message
    if( header.contentType && header.contentType.mime === 'message/rfc822' ) {
      this[0] = require('../envelope')( this[0] )
    }

  }

}

Body.prototype = Object.create( null )

module.exports = Body


var mime = require( 'mime-lib' )
var iconv = require( 'codes' )

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
      ~header.contentType.mime.indexOf( 'text' )
    
    this[0] = body.trim()
    
    // Automatically create a buffer from
    // non-text base64 encoded data
    if( !isText && header.contentTransferEncoding === 'base64' ) {
      this[0] = new Buffer( this[0], 'base64' )
    }
    
    // Automatically decode text from either
    // base64 or quoted-printable encoding
    if( isText ) {
      if( header.contentTransferEncoding === 'quoted-printable' )
        this[0] = mime.decodeQP( this[0] )
      if( header.contentTransferEncoding === 'base64' )
        this[0] = new Buffer( this[0], 'base64' ).toString()
    }
    
    // Try to convert to UTF8, if it's not UTF8 yet
    var charset = header.contentType &&
      header.contentType.charset
    
    if( charset ) {
      try { this[0] = iconv.decode( this[0], charset ) }
      catch( e ) { /* unsupported by iconv */ }
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

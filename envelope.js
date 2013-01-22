
var mime = require( 'mime-lib' )
var buffer = require( './lib/buffer' )

/**
 * Envelope
 * @param {String|Buffer} mail
 */
function Envelope( mail ) {
  
  if( !(this instanceof Envelope) )
    return new Envelope( mail )
  
  if( !Buffer.isBuffer( mail ) )
    mail = new Buffer( mail )
  
  var boundary = buffer.indexOf(
    new Buffer( "\r\n\r\n" ), mail
  )
  
  if( !~boundary ) {
    boundary = boundary < 0 ? 0 : boundary
  }
  
  this.original = {
    header: mail.slice( 0, boundary ),
    body:   mail.slice( boundary )
  }
  
  this.header = Envelope.parseHeader( this.original.header )
  this.parseBody( this.original.body )
  
}

Envelope.filter = require( './lib/filter' )

Envelope.parse = function( mail ) {
  return new Envelope( mail )
}

/**
 * @param  {Buffer} header
 * @return {Object} 
 */
Envelope.parseHeader = function( header ) {
  
  // Buffer -> String
  header = header.toString()
  // Unfold folded header lines
  header = header.replace( /\r\n\s+/g, ' ' )
  
  // String -> Array of lines
  var lines = header.split( '\r\n' )
  // Splits line up into a key/value pair
  var pattern = /^([^:]*?)[:]\s*?([^\s].*)/
  var field, key, value, header = {}
  
  // Convert each line
  for( var i = 0; i < lines.length; i++ ) {
    // Split line up into a key/value pair
    if( field = pattern.exec( lines[i] ) ) {
      // Make the key js-dot-notation accessible (to camelCase)
      key = field[1].toLowerCase().replace(
        /-([^-])/ig, function( m, chr ) {
          return chr.toUpperCase()
        }
      )
      // Apply matched filters to the field value
      value = Envelope.filter( key, field[2].trim() )
      // Store value under it's key
      if ( header[ key ] && header[ key ].push ) {
        header[ key ].push( value )
      } else if ( header[ key ] ) {
        header[ key ] = [ header[ key ], value ]
      } else {
        header[ key ] = value
      }
    }
  }
  
  return header
  
}

/**
 * Envelope prototype
 * @type {Object}
 */
Envelope.prototype = {
  
  /**
   * @param  {Buffer} body
   * @return {Object}
   */
  parseBody: function( body ) {
    
    body = body.toString()
      
    var header   = this.header
    var boundary = header.contentType && header.contentType.boundary
    var bounds   = []
    var index    = -1
    
    if( boundary ) {
      
      var start = '--' + boundary + '\r\n'
      var end   = '--' + boundary + '--'
      
      index = body.indexOf( start )
      
      while( ~index ) {
        bounds.push( index )
        index += start.length
        index  = body.indexOf( start, index )
      }
      
      var b = start.length
      var c = bounds.length
      
      for( var i = 0; i < c; i++ ) {
        this[i] = body.slice( bounds[i] + b, bounds[ i + 1 ] || void 0 )
        this[i] = new Envelope( this[i] )
      }
      
    } else {
      
      var isText = header.contentType && /^text/.test( header.contentType.mime )
      
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
      
    }
    
    return this
    
  }
  
}

module.exports = Envelope

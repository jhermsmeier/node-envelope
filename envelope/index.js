var mime = require( 'mime-lib' )
var BMH = require( './bmh' )
var CRLFCRLF = new Buffer( '\r\n\r\n' )

/**
 * Envelope Constructor
 * @return {Envelope}
 */
function Envelope() {
  
  if( !(this instanceof Envelope) )
    return new Envelope()
  
  // this.original = null
  this.headers = []
  
}

/**
 * [parse description]
 * @param  {Buffer} value
 * @return {Envelope}
 */
Envelope.parse = function( value ) {
  return new Envelope().parse( value )
}

/**
 * Envelope Prototype
 * @type {Object}
 */
Envelope.prototype = {
  
  constructor: Envelope,
  
  _decodeHeaderObject: function( label, field ) {
    
    var header = this.getHeader( field )
    if( header == null )
      return header
    
    var pattern = /^([^=]*?)([=](['"]?)([^\3]*)\3)?$/
    var input = header.split( /;\s*/g )
    var contentType = {}
    
    contentType[ label ] = input.shift()
    
    var i, m, len = input.length
    
    for( i = 0; i < len; i++ ) {
      if( m = pattern.exec( input[i] ) ) {
        if( m[4] ) {
          contentType[ m[1].toLowerCase() ] =
            mime.decodeWord( m[4] )
        }
      }
    }
    
    return contentType
    
  },
  
  get contentType() {
    return this._decodeHeaderObject( 'mime', 'content-type' )
  },
  
  get contentDisposition() {
    return this._decodeHeaderObject( 'disposition', 'content-disposition' )
  },
  
  getHeaders: function( field ) {
    
    field = field.toLowerCase()
    
    var i, len = this.headers.length
    var value, result = []
    
    for( i = 0; i < len; i += 2 ) {
      if( this.headers[i] === field ) {
        value = Header.transform( field, this.headers[ i + 1 ] )
        result.push( value )
      }
    }
    
    return result
    
  },
  
  getHeader: function( field ) {
    
    field = field.toLowerCase()
    
    var value, result = []
    
    for( var i = 0; i < this.headers.length; i += 2 ) {
      if( this.headers[i] === field ) {
        return this.headers[ i + 1 ]
      }
    }
    
  },
  
  parse: function( value, parent ) {
    
    // TODO: check if first char is '{'
    //  => parse as JSON, otherwise normal
    
    var buffer = Buffer.isBuffer( value ) ?
      value.slice() : new Buffer( value )
    
    // If no header boundary was found, there's probably no body...
    // (Sounds like a murder, doesn't it?)
    var boundaryIndex = this.parseHeader( buffer )
    if( boundaryIndex < 0 ) return this
    
    if( parent == null )
      this.original = buffer
    
    // Discard header
    buffer = buffer.slice( boundaryIndex )
    
    // Check for multipart
    var contentType = this.contentType
    var marker = contentType && contentType.boundary
    
    // No boundary -> not multipart,
    // no need for further parsing
    marker != null ?
      this.parseMultipart( buffer, marker ) :
      this[0] = buffer
    
    return this
    
  },
  
  parseHeader: function( buffer ) {
    
    // Search for the first occurrence of <CR><LF><CR><LF>,
    // which marks the end of the mail header
    // <CR> = 0x0D; <LF> = 0x0A
    var searcher = new BMH( buffer )
    var index = searcher.indexOf( CRLFCRLF )
    var boundary = ~index ? index : buffer.length
    
    var headers = buffer.slice( 0, boundary ).toString()
      // Unfold folded header lines
      .replace( /\r\n\s/g, '' )
      // String -> Array of lines
      .split( /\r\n/g )
    
    // Splits line up into a key/value pair
    for( var i = 0; i < headers.length; i++ ) {
      var sep = headers[i].indexOf( ':' )
      this.headers.push(
        headers[i].substr( 0, sep ).trim().toLowerCase(),
        headers[i].substr( sep + 1 ).trim()
      )
    }
    
    return index
    
  },
  
  parseMultipart: function( buffer, boundary ) {
    
    var startBound = new Buffer( '--' + boundary + '\r\n' )
    var endBound = new Buffer( '--' + boundary + '--' )
    
    // TODO: If no boundary is found, even though
    // a boundary is given or contentType is multipart;
    // try to detect a boundary by educated guesses
    // (look for "--XXXX\r\n" and/or "--XXXXX--\r\n")
    var searcher = new BMH( buffer )
    var start = searcher.indexOf( startBound )
    var end = searcher.indexOf( endBound, startBound.length )
    
    if( ~start ) {
      
      var i = 0, index, indices = []
      
      while( ~( index = searcher.indexOf( startBound, index + 1 ) ) ) {
        indices.push( index )
      }
      
      for( i = 0; i < indices.length; i++ ) {
        this[i] = new Envelope().parse(
          buffer.slice( indices[i], indices[ i + 1 ] ),
          this // -> parent (unused at the moment)
        )
      }
      
    } else {
      this[0] = buffer
    }
    
    return this
    
  },
  
  toString: function() {
    return ''
  },
  
}

// Exports
module.exports = Envelope

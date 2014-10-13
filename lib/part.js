var mime = require( 'mime-lib' )
var BMH = require( './bmh' )
var CRLFCRLF = new Buffer( '\r\n\r\n' )

/**
 * Part Constructor
 * @return {Part}
 */
function Part() {
  
  if( !(this instanceof Part) )
    return new Part()
  
  // this.original = null
  this.headers = []
  
}

/**
 * [parse description]
 * @param  {Buffer} value
 * @return {Part}
 */
Part.parse = function( value ) {
  return new Part().parse( value )
}

// Parses the headers and adds them to 'part',
// then return index of EOD of the header
Part.parseHeader = function( part, buffer ) {
  
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
    part.headers.push(
      headers[i].substr( 0, sep ).trim().toLowerCase(),
      headers[i].substr( sep + 1 ).trim()
    )
  }
  
  return index
  
}

Part.parseMultipart = function( part, buffer, boundary ) {
  
  // TODO: If no boundary is found, even though
  // a boundary is given or contentType is multipart;
  // try to detect a boundary by educated guesses
  // (look for "--XXXX\r\n" and/or "--XXXXX--\r\n")
  
  var startBound = new Buffer( '--' + boundary + '\r\n' )
  var endBound = new Buffer( '--' + boundary + '--' )
  
  var searcher = new BMH( buffer )
  var start = searcher.indexOf( startBound )
  var end = searcher.indexOf( endBound, startBound.length )
  
  if( ~start ) {
    
    var i = 0, index, indices = []
    
    while( ~( index = searcher.indexOf( startBound, index + 1 ) ) ) {
      indices.push( index )
    }
    
    for( i = 0; i < indices.length; i++ ) {
      part[i] = Part.parse(
        buffer.slice( indices[i], indices[ i + 1 ] )
      )
    }
    
  } else {
    part[0] = buffer
  }
  
  return part
  
}

/**
 * Part Prototype
 * @type {Object}
 */
Part.prototype = {
  
  constructor: Part,
  
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
        if( m != null && m[4] != null ) {
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
        result.push( this.headers[ i + 1 ] )
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
  
  parse: function( value ) {
    
    // TODO: check if first char is '{'
    //  => parse as JSON, otherwise normal
    
    var buffer = Buffer.isBuffer( value ) ?
      value.slice() : new Buffer( value )
    
    // If no header boundary was found, there's probably no body...
    // (Sounds like a murder, doesn't it?)
    var boundaryIndex = Part.parseHeader( this, buffer )
    if( boundaryIndex < 0 ) return this
    
    // Discard header
    buffer = buffer.slice( boundaryIndex )
    
    // Check for multipart
    var contentType = this.contentType
    var marker = contentType && contentType.boundary
    
    if( marker != null ) {
      Part.parseMultipart( this, buffer, marker )
    } else {
      // No boundary -> not multipart,
      // no need for further parsing
      this[0] = buffer
    }
    
    return this
    
  },
  
  toString: function() {
    return ''
  },
  
}

// Exports
module.exports = Part

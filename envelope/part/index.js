var Envelope = require( '../' )
var mime = require( 'mime-lib' )
var BMH = require( '../bmh' )
var assert = require( 'assert' )

/**
 * Envelope Body Part Constructor
 * @return {Part}
 */
function Part() {
  
  if( !(this instanceof Part) )
    return new Part()
  
  this.header = new Envelope.Header()
  
}

// Exports
module.exports = Part

Part.parse = function( value ) {
  return new Part().parse( value )
}

/**
 * Envelope Body Part Prototype
 * @type {Object}
 */
Part.prototype = {
  
  constructor: Part,
  
  get isAttachment() {
    var disposition = this.header.get( 'content-disposition' )
    return /^attachment/i.test(
      disposition && disposition.mime
    )
  },
  
  get parts() {
    var self = this
    return Object.keys( this )
      .reduce( function( parts, k ) {
        if( self[k] instanceof Part )
          parts.push( self[k] )
        return parts
      }, [])
  },
  
  parse: function( value ) {
    
    // TODO: check if first char is '{'
    //  => parse as JSON, otherwise normal
    
    var buffer = Buffer.isBuffer( value ) ?
      value : new Buffer( value )
    
    // If no header boundary was found, there's probably no body...
    // (Sounds like a murder investigation, doesn't it?)
    var boundary = this.parseHeader( buffer )
    if( boundary < 0 ) return this
    
    // Discard header
    buffer = buffer.slice( boundary )
    
    // Check for multipart
    var contentType = this.header.get( 'content-type' )
    var marker = contentType && contentType.boundary
    
    // No boundary -> not multipart,
    // no need for further parsing
    marker ?
      this.parseMultipart( buffer, marker ) :
      this[0] = buffer
    
    return this
    
  },
  
  parseHeader: function( buffer ) {
    
    // Search for the first occurrence of <CR><LF><CR><LF>,
    // which marks the end of the mail header
    // <CR> = 0x0D; <LF> = 0x0A
    var searcher = new BMH( buffer )
    var index = searcher.indexOf( Envelope.Header.EOD )
    var boundary = ~index ? index : buffer.length
    
    this.header.parse(
      buffer.slice( 0, boundary )
    )
    
    return index
    
  },
  
  parseMultipart: function( buffer, boundary ) {
    
    var startBound = '--' + boundary + '\r\n'
    var endBound = '--' + boundary + '--'
    
    // TODO: If no boundary is found, even though
    // a boundary is given or contentType is multipart;
    // try to detect a boundary by educated guesses
    // (look for "--XXXX\r\n" and/or "--XXXXX--\r\n")
    var searcher = new BMH( buffer )
    var start = searcher.indexOf( startBound )
    var end = searcher.indexOf( endBound )
    
    if( ~start ) {
      
      var i = 0, index, indices = []
      var body = buffer.slice(
        start + Buffer.byteLength( startBound ), end
      )
      
      while( ~( index = searcher.indexOf( startBound, index + 1 ) ) ) {
        indices.push( index )
      }
      
      for( i = 0; i < indices.length; i++ ) {
        this[i] = Part.parse(
          buffer.slice( indices[i], indices[ i + 1 ] )
        )
      }
      
    } else {
      this[0] = buffer
    }
    
    return this
    
  },
  
  toJSON: function() {
    return JSON.stringify( this, null, 2 )
  },
  
  toString: function( encoding ) {
    return this.header.toString( encoding )
      // TODO
      // this.body.toString( encoding )
  }
  
}

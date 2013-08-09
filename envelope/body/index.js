var mime = require( 'mime-lib' )

/**
 * Envelope.Body constructor
 */
function Body() {
  
  if( !(this instanceof Body) )
    return new Body()
  
  this._buffer = new Buffer( 0 )
  this._envelope = null
  
  // Make "private" properties non-enumerable
  Object.keys( this ).map( function( key ) {
    key[0] === '_' ? Object.defineProperty( this, key, {
      value: this[ key ], writable: true,
      configurable: true, enumerable: false,
    }) : null
  }.bind( this ))
  
}

// Exports
module.exports = Body

/**
 * Body prototype
 * @type {Object}
 */
Body.prototype = {
  
  constructor: Body,
  
  _indexOf: function( str, offset ) {
    
    var needle = new Buffer( str )
    var haystack = this._buffer
    
    function equal( a, b ) {
      var i = 0, len = a.length
      while( i < len && a[i] === b[i] ) { i++ }
      return i === len
    }
    
    var match, chunk = needle.length
    var len = haystack.length
    var i = offset || 0
    
    for( ; i < len; i++ ) {
      match = equal( needle, haystack.slice( i, i + chunk ) )
      if( match ) { return i; break }
    }
    
    return -1
    
  },
  
  _lastIndexOf: function( str ) {
    
    var needle = new Buffer( str )
    var haystack = this._buffer
    
    function equal( a, b ) {
      var i = 0, len = a.length
      while( i < len && a[i] === b[i] ) { i++ }
      return i === len
    }
    
    var match, chunk = needle.length
    var i, len = haystack.length
    
    for( i = len - chunk; i > 0; i-- ) {
      match = equal( needle, haystack.slice( i, i + chunk ) )
      if( match ) { return i; break }
    }
    
    return -1
    
  },
  
  _split: function( boundary ) {
    
    var startBound = '--' + boundary + '\r\n'
    var endBound = '--' + boundary + '--'
    
    // TODO: If no boundary is found, even though
    // a boundary is given or contentType is multipart;
    // try to detect a boundary by educated guesses
    // (look for "--XXXX\r\n" and/or "--XXXXX--\r\n")
    var start = this._indexOf( startBound )
    var end   = this._lastIndexOf( endBound )
    
    if( ~start ) {
      
      var i = 0, index, indices = []
      var body = this._buffer.slice(
        start + startBound.length, end
      )
      
      while( ~( index = this._indexOf( startBound, index + 1 ) ) ) {
        indices.push( index )
      }
      
      for( i = 0; i < indices.length; i++ ) {
        this[i] = new this._envelope.constructor().parse(
          this._buffer.slice( indices[i], indices[i+1] )
        )
      }
      
    } else {
      this[0] = this._buffer
    }
    
    return this
    
  },
  
  parse: function( buffer, envelope ) {
    
    if( !Buffer.isBuffer( buffer ) ) {
      throw new TypeError( 'First argument needs to be a buffer.' )
    }
    
    this._buffer = buffer
    this._envelope = envelope
    
    var header = envelope && envelope.header
    var boundary = header && header.contentType &&
      header.contentType.boundary
    
    boundary ?
      this._split( boundary ) :
      this[0] = buffer
    
    return this
    
  },
  
  toString: function( encoding ) {
    
    return ''
    
  }
  
}

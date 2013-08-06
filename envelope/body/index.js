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
  
  parse: function( buffer ) {
    
    if( !Buffer.isBuffer( buffer ) ) {
      throw new TypeError(
        'First argument needs to be a buffer.'
      )
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
  
  toString: function() {
    
  }
  
}

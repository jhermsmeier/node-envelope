/**
 * Envelope.Body constructor
 */
function Body() {
  
  if( !(this instanceof Body) )
    return new Body()
  
  this._buffer = new Buffer( 0 )
  
  // Make "private" properties non-enumerable
  Object.keys( this ).map( function( key ) {
    key[0] === '_' ? Object.defineProperty( this, key, {
      value: this[ key ], writable: true,
      configurable: true, enumerable: false,
    }) : null
  }.bind( this ))
  
}

Body.Part = require( './part' )

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
    
    
    
    return this
    
  },
  
  toString: function() {
    
  }
  
}

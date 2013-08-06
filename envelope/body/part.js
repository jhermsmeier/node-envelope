/**
 * Envelope.Body.Part constructor
 */
function Part() {
  
  if( !(this instanceof Part) )
    return new Part()
  
  this._buffer = new Buffer( 0 )
  
  // Make "private" properties non-enumerable
  Object.keys( this ).map( function( key ) {
    key[0] === '_' ? Object.defineProperty( this, key, {
      value: this[ key ], writable: true,
      configurable: true, enumerable: false,
    }) : null
  }.bind( this ))
  
}

/**
 * Part prototype
 * @type {Object}
 */
Part.prototype = {
  
  constructor: Part,
  
  parse: function( buffer ) {
    
  },
  
  toString: function() {
    
  }
  
}

var mime = require( 'mime-lib' )
var inherit = require( 'blooline' )

/**
 * Envelope Constructor
 * @return {Envelope}
 */
function Envelope() {
  
  if( !(this instanceof Envelope) )
    return new Envelope()
  
  this.original = null
  
  Envelope.Part.call( this )
  
}

/**
 * Envelope Part Constructor
 * @type {Function}
 */
Envelope.Part = require( './part' )

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
  
  toString: function() {
    return ''
  },
  
}

// Inherit from Part
inherit( Envelope, Envelope.Part )
// Exports
module.exports = Envelope

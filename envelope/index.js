/**
 * Envelope constructor
 */
function Envelope( options ) {
  
  if( !(this instanceof Envelope) )
    return new Envelope( options )
  
  this._buffer = new Buffer( 0 )
  
  // this.version = require( '../package' ).version
  
  this.header = new Envelope.Header()
  this.body = new Envelope.Body()
  
  // Make "private" properties non-enumerable
  Object.keys( this ).map( function( key ) {
    key[0] === '_' ? Object.defineProperty( this, key, {
      value: this[ key ], writable: true,
      configurable: true, enumerable: false,
    }) : null
  }.bind( this ))
  
}

Envelope.Header = require( './header' )
Envelope.Body = require( './body' )

/**
 * Creates a new Envelope
 * @param  {Object} options
 * @return {Envelope}
 */
Envelope.create = function( options ) {
  return new Envelope( options )
}

/**
 * Parses an email into an Envelope
 * @param  {Buffer|String} buffer
 * @param  {Object} options
 * @return {Envelope}
 */
Envelope.parse = function( buffer, options ) {
  return new Envelope( options )
    .parse( buffer )
}

/**
 * Parses an email header
 * @param  {Buffer|String} buffer
 * @param  {Object} options
 * @return {Envelope.Header}
 */
Envelope.parseHeader = function( buffer, options ) {
  return new Envelope.Header( options )
    .parse( buffer )
}

// Exports
module.exports = Envelope

/**
 * Envelope prototype
 * @type {Object}
 */
Envelope.prototype = {
  
  constructor: Envelope,
  
  setHeader: function( name, value, properties ) {
    this.header.set( name, value, properties )
    return this
  },
  
  parse: function( buffer ) {
    
    if( !Buffer.isBuffer( buffer ) ) {
      throw new TypeError(
        'First argument needs to be a buffer.'
      )
    }
    
    this._buffer = buffer
    
    // Search for the first occurrence of <CR><LF><CR><LF>,
    // which marks the end of the mail header
    // <CR> = 0x0D; <LF> = 0x0A
    var boundary, len = buffer.length - 4
    for( boundary = 0; boundary < len; boundary++ ) {
      if( buffer.readUInt32BE( boundary ) === 0x0D0A0D0A ) {
        this.header.parse( buffer.slice( 0, boundary ) )
        break
      }
    }
    
    // Parse rest as the body
    this.body.parse( buffer.slice( boundary + 4 ), this )
    
    return this
    
  },
  
  toString: function() {
    
  }
  
}

/**
 * Envelope constructor
 */
function Envelope( options ) {
  
  if( !(this instanceof Envelope) )
    return new Envelope( options )
  
  this._buffer = new Buffer( 0 )
  
  this.header = new Envelope.Header()
  this.body = new Envelope.Body()
  
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
    .extract( buffer )
}

// Exports
module.exports = Envelope

/**
 * Envelope prototype
 * @type {Object}
 */
Envelope.prototype = {
  
  constructor: Envelope,
  
  getHeader: function( name ) {
    return this.header.get( name )
  },
  
  setHeader: function( name, value, properties ) {
    this.header.set( name, value, properties )
    return this
  },
  
  parse: function( buffer ) {
    
    if( !Buffer.isBuffer( buffer ) ) {
      throw new TypeError( 'First argument needs to be a buffer.' )
    }
    
    this._buffer = buffer
    
    // Extract the header
    this.header.extract( buffer )
    
    // Parse rest as the body
    this.body.parse(
      buffer.slice( this.header._buffer.length + 4 ),
      this
    )
    
    return this
    
  },
  
  toString: function( encoding ) {
    return this.header.toString( encoding ) +
      this.body.toString( encoding )
  }
  
}

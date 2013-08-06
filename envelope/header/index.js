var mime = require( 'mime-lib' )

/**
 * Envelope.Header constructor
 */
function Header() {
  
  if( !(this instanceof Header) )
    return new Header()
  
  this._buffer = new Buffer( 0 )
  
  // Make "private" properties non-enumerable
  Object.keys( this ).map( function( key ) {
    key[0] === '_' ? Object.defineProperty( this, key, {
      value: this[ key ], writable: true,
      configurable: true, enumerable: false,
    }) : null
  }.bind( this ))
  
}

// Exports
module.exports = Header

Header.transform = require( './transform' )

/**
 * Makes the key js-dot-notation accessible (to camelCase)
 * @param  {String} key
 * @return {String} 
 */
Header.toCamelCase = function( key ) {
  return key.toLowerCase().replace(
    /-([^-])/ig, function( match, chr ) {
      return chr.toUpperCase()
    }
  )
}

/**
 * Turns a camelCase header field key
 * back into it's valid email header form
 * @param  {String} key
 * @return {String} 
 */
Header.toDashedCase = function( key ) {
  return key.replace( /[A-Z]/g, function( match ) {
    return '-' + match
  }).replace( /^./, function( match ) {
    return match.toUpperCase()
  })
}

/**
 * Header prototype
 * @type {Object}
 */
Header.prototype = {
  
  constructor: Header,
  
  /**
   * Retrieves a given header field
   * @param  {String} key
   * @return {Mixed}  value
   */
  get: function( key ) {
    key = this.camelCase( key )
    return this[ key ]
  },
  
  /**
   * Sets a header field to the given value
   * @param  {String}  key
   * @param  {String}  value
   * @param  {Object}  properties
   * @param  {Boolean} overwrite
   * @return {Header}
   */
  set: function( key, value, properties, overwrite ) {
    
    key = Header.toCamelCase( key )
    
    value = mime.decodeWord( value.trim() )
    value = Header.transform( key, value )
    
    if( overwrite === true ) {
      this[ key ] = value
    } else if( this[ key ] && this[ key ].push ) {
      this[ key ].push( value )
    } else if( this[ key ] ) {
      this[ key ] = [ this[ key ], value ]
    } else {
      this[ key ] = value
    }
    
    return this
    
  },
  
  /**
   * Parses a header field
   * @param  {String} line
   * @param  {Boolean} overwrite
   * @return {Header}
   */
  parseField: function( line, overwrite ) {
    
    // Splits line up into a key/value pair
    var pattern = /^([^:]*?)[:]\s*?([^\s].*)/
    var field, key, value
    
    if( field = pattern.exec( line ) ) {
      this.set( field[1], field[2], null, overwrite )
    }
    
    return this
    
  },
  
  parse: function( buffer ) {
    
    if( !Buffer.isBuffer( buffer ) ) {
      throw new TypeError(
        'First argument needs to be a buffer.'
      )
    }
    
    this._buffer = buffer
    
    // We should be able to safely convert our
    // header buffer to a UTF8 string
    buffer.toString()
      // Unfold folded header lines
      .replace( /\r\n\s+/g, ' ' )
      // String -> Array of lines
      .split( '\r\n' )
      // Parse each field line
      .forEach( this.parseField.bind( this ) )
    
    return this
    
  },
  
  toString: function() {
    
  }
  
}

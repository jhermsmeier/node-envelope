var mime = require( 'mime-lib' )

/**
 * Envelope Header Constructor
 * @return {Header}
 */
function Header() {
  
  if( !(this instanceof Header) )
    return new Header()
  
  this.raw = []
  
}

// Exports
module.exports = Header

/**
 * Turns a camelCase header field key
 * back into it's valid email header form
 * @param  {String} value
 * @return {String} 
 */
function toDashCase( value ) {
  
  if( /-([^-])/ig.test( value ) )
    value = ( value + '' ).toLowerCase()
  
  return value.replace( /[A-Z]/g, function( match ) {
    return '-' + match
  }).replace( /^./, function( match ) {
    return match.toUpperCase()
  })
  
}

Header.EOD = new Buffer( '\r\n\r\n' )

/**
 * Formats a field value for toString()
 * @param  {String} key
 * @param  {Mixed}  value
 * @return {String}
 */
Header.format = require( './format' )

/**
 * Transforms a field into an
 * object representation
 * @type {Mixed}
 */
Header.transform = require( './transform' )

Header.parse = function( value ) {
  return new Header().parse( value )
}

function logtime( time ) {
  var ms = Math.round( (time[1] * 10e-7)*1000 )/1000 + ( time[0] / 1000 )
  return ( ms.toString() + ' ms' )
}

/**
 * Envelope Header prototype
 * @type {Object}
 */
Header.prototype = {
  
  constructor: Header,
  
  get: function( field ) {
    
    field = ( field + '' ).toLowerCase()
    
    var i, len = this.raw.length
    var value, result = []
    
    for( i = 0; i < len; i += 2 ) {
      if( this.raw[i] === field ) {
        value = Header.transform( field, this.raw[ i + 1 ] )
        result.push( value )
      }
    }
    
    return result.length > 1 ?
      result : result[0]
    
  },
  
  set: function( field, value ) {
    
    field = field.toLowerCase()
    
    if( typeof value !== 'string' )
      value = Header.format( field, value )
    
    // Convert field name to camelCase and
    // make sure it's a string
    this.raw.push(
      field, mime.decodeWord( value )
    )
    
    return this
    
  },
  
  // Clear a header field...
  clear: function( field ) {
    field = ( field + '' ).toLowerCase()
    this[ field ] = null
    delete this[ field ]
    return this
  },
  
  parse: function( value ) {
    
    // Make sure we have a string at hand
    var lines = ( value + '' )
      // Unfold folded header lines
      .replace( /\r\n\s+/g, ' ' )
      // String -> Array of lines
      .split( /\r\n/g )
    
    // Splits line up into a key/value pair
    for( var i = 0; i < lines.length; i++ ) {
      var sep = lines[i].indexOf( ':' )
      this.set(
        lines[i].substr( 0, sep ),
        lines[i].substr( sep + 1 ).trim()
      )
    }
    
    return this
    
  },
  
  toJSON: function() {
    return JSON.stringify( this, null, 2 )
  },
  
  toString: function() {
    
    const CRLF = '\r\n'
    
    var self = this
    var fields = []
    
    Object.keys( this ).forEach(
      function( key ) {
        
        var value = self[ key ]
        var line = mime.foldLine(
          toDashCase( key ) + ': ' +
          Header.format( key, value )
        )
        
        fields.push( line )
        
      }
    )
    
    return fields.join( CRLF ) +
      CRLF + CRLF
    
  },
  
}

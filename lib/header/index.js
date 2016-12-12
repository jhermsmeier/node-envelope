var mime = require( 'mime-lib' )

function Header( header ) {

  if( !(this instanceof Header) )
    return new Header( header )

  // Unfold folded header lines
  header = header.replace( /\r\n\s+/g, ' ' )
  // String -> Array of lines
  header = header.split( '\r\n' )

  // Splits line up into a key/value pair
  var pattern = /^([^:]*?)[:]\s*?([^\s].*)/
  var field, key, value, length = header.length

  // Convert each line
  for( var i = 0; i < length; i++ ) {
    // Split line up into a key/value pair
    if( field = pattern.exec( header[i] ) ) {
      // Make the key js-dot-notation accessible (to camelCase)
      key = field[1].toLowerCase().replace(
        /-([^-])/ig, function( m, chr ) {
          return chr.toUpperCase()
        }
      )
      // Decode MIME words and/or QP encoded values
      value = Header.filter( '_MIMEWords', field[2].trim() )
      // Apply matched filters to the field value
      value = Header.filter( key, value )
      // Store value under it's key
      if ( this[ key ] && this[ key ].push ) {
        this[ key ].push( value )
      } else if ( this[ key ] ) {
        this[ key ] = [ this[ key ], value ]
      } else {
        this[ key ] = value
      }
    }
  }

}

Header.prototype = Object.create( null )
Header.filter = require( './filter' )

module.exports = Header

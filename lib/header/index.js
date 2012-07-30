
/**
 * Header
 * @param {String|Buffer} data
 */
function Header( data ) {
  
  if( !(this instanceof Header) )
    return new Header( data )
  
  if( data ) this.parse( data )
  
}

/**
 * Header field filters
 * @type {Function}
 */
Header.filter = require( './filter' )

/**
 * Header prototype
 * @type {Object}
 */
Header.prototype = {
  
  /**
   * @param  {String|Buffer} header
   * @return {Object} 
   */
  parse: function( header ) {
    
    // Buffer -> String
    header = header + ''
    // Unfold folded header lines
    header = header.replace( /\r\n\s+/g, ' ' )
    // String -> Array of lines
    header = header.split( '\r\n' )
    
    // Splits line up into a key/value pair
    var pattern = /^([^:]*?)[:]\s*?([^\s].*)/
    // Header line count
    var lines = header.length
    var field, key, value
    
    // Convert each line
    for ( i = 0; i < lines; i++ ) {
      // Split line up into a key/value pair
      field = pattern.exec( header[i] )
      // Make the key js-dot-notation accessible
      key   = field[1].toLowerCase().replace( /[^a-z0-9]/gi, '_' )
      value = Header.filter( key, field[2].trim() )
      // Store value under it's key
      if ( this[ key ] && this[ key ].push ) {
        this[ key ].push( value )
      } else if ( this[ key ] ) {
        this[ key ] = [ this[ key ], value ]
      } else {
        this[ key ] = value
      }
      
    }
    
    return this
    
  },
  
  /**
   * Branches out header fields under a given slug.
   * 
   * For example, if you have this in your `envelope.header`:
   * 
   *     'list_archive': 'https://github.com/...',
   *     'list_unsubscribe': '<mailto:unsub...@reply.github.com>',
   *     'list_id': '<...github.com>',
   * 
   * Then you can transform your envelope.header with
   * `envelope.header.branch( 'list' )` to:
   * 
   *     'list': {
   *        'archive': 'https://github.com/...',
   *        'unsubscribe': '<mailto:unsub...@reply.github.com>',
   *        'id': '<...github.com>'
   *      }
   * 
   * @param  {Array}   slugs
   * @param  {Boolean} [modify = false]
   * @return {Object}  header
   */
  branch: function( slugs, modify ) {
    
    var slug_count = slugs.length
    var object     = {}
    
    if( slug_count === 0 ) {
      return object
    }
    
    var slug, key, value
    var k, swap, pattern
    
    for( var i = 0; i < slug_count; i++ ) {
      
      slug    = slugs[i]
      pattern = new RegExp( '^' + slug + '_' )
      swap    = {}
      k       = 0
      
      for( key in this ) {
        if( pattern.test( key ) ) {
          swap[ key.replace( patter, '' ) ] = this[ key ]
          delete this[ key ]
          k++
        }
      }
      
      if( k !== 0 ) {
        if( modify ) this[ slug ] = swap
        object[ slug ] = swap
      }
      
    }
    
    return slug_count > 1
      ? object
      : swap
    
  }
  
}

// Make prototype properties !enumerable
Object.keys( Header.prototype ).forEach( function ( key ) {
  Object.defineProperty( Header.prototype, key, { enumerable: false } )
})

module.exports = Header

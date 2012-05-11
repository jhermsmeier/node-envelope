
var __slice = Array.prototype.slice
var mime = require( 'mime-lib' )

function Header( lines ) {
  
  if( !(this instanceof Header) )
    return new Header( lines )
  
  if( lines != null ) {
    this.parse( lines )
  }
  
}

Header.filter = require( './filter' )

Header.prototype = {
  
  /**
   * [parse description]
   * 
   * @param  {Array} lines
   * @return {Null}
   */
  parse: function( lines ) {
    
    var i = 0, c = lines.length
    var key, value, field
    
    for( ; i < c; i++ ) {
      
      field = /^([^:]*?)[:]\s*?([^\s].*)/.exec( lines[i] )
      key   = field[1].toLowerCase().replace( /[^a-z0-9]/gi, '_' )
      value = field[2].trim()
      
      this[ key ] = Header.filter( key, value )
      
    }
    
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
   * @param  {String} slugs...
   * @param  {Boolean} [modify]
   * @return {Object} 
   */
  branch: function() {
    
    var slugs = __slice.call( arguments ),
        i = 0, k = 0, length = slugs.length,
        slug, regex, swap, key, value,
        ret = {}, modify = false
    
    if( length === 0 ) { return }
    
    if( typeof slugs[ length - 1 ] !== 'string' ) {
      modify = slugs.pop()
    }
    
    for( ; i < length; i++ ) {
      
      slug  = slugs[i]
      regex = new RegExp( '^' + slug + '_' )
      k     = 0
      swap  = {}
      
      for( key in this ) {
        if( this.hasOwnProperty( key ) && regex.test( key ) ) {
          swap[ key.replace( regex, '' ) ] = this[ key ]
          delete this[ key ]
          k++
        }
      }
      
      if( k !== 0 ) {
        if( modify ) { this[ slug ] = swap }
        ret[ slug ] = swap
      }
      
    }
    
    return length > 1 ? ret : swap
    
  }
  
}

module.exports = Header

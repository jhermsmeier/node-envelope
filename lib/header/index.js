
var util    = require( '../util' );
var __slice = Array.prototype.slice;

module.exports = (function() {
  
  'use strict';
  
  function Header( fields ) {
    
    if( !(this instanceof Header) )
      return new Header( fields );
    
    this.parse( fields );
    
    this.branch(
      'list',
      'content',
      'x'
    );
    
  }
  
  Header.filter = require( './filter' );
  
  Header.prototype = {
    
    /**
     * [parse description]
     * 
     * @param  {Array} fields
     * @return {Null}
     */
    parse: function( fields ) {
      
      var i = 0, c = fields.length;
      var key, value, field;
      
      for( ; i < c; i++ ) {
        
        field = /^([^:]*?)[:]\s*?([^\s].*)/.exec( fields[i] );
        key   = util.toKey( field[1] );
        value = field[2].trim();
        
        this[ key ] = Header.filter( key, value );
        
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
     * @return {Null} 
     */
    branch: function() {
      
      var slugs = __slice.call( arguments ),
          i = 0, k = 0, length = slugs.length,
          slug, regex, swap, key, value;
      
      for( ; i < length; i++ ) {
        
        slug  = slugs[i];
        regex = new RegExp( '^' + slug + '_' );
        k     = 0;
        swap  = {};
        
        for( key in this ) {
          if( this.hasOwnProperty( key ) && regex.test( key ) ) {
            swap[ key.replace( regex, '' ) ] = this[ key ];
            delete this[ key ];
            k++;
          }
        }
        
        if( k !== 0 ) this[ slug ] = swap;
        
      }
      
    }
    
  }
  
  return Header;
  
})();

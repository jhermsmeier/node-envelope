var assert = require( 'assert' )

/**
 * BoyerMooreHorspool constructor
 * @param {Buffer} haystack
 */
function BoyerMooreHorspool( haystack ) {
  
  assert( haystack, 'Haystack must be a buffer' )
  
  if( !(this instanceof BoyerMooreHorspool) )
    return new BoyerMooreHorspool( haystack )
  
  this.haystack = Buffer.isBuffer( haystack ) ?
    haystack : new Buffer( haystack )
  
}

/**
 * BoyerMooreHorspool prototype
 * @type {Object}
 */
BoyerMooreHorspool.prototype = {
  
  constructor: BoyerMooreHorspool,
  
  indexOf: function( needle, start ) {
    
    needle = Buffer.isBuffer( needle ) ?
      needle : new Buffer( needle )
    
    var stack = this.haystack
    var nlen = needle.length
    var hlen = stack.length
    
    if( nlen <= 0 || hlen <= 0 )
      return -1
    
    var jump, offset = start || 0
    var scan = 0
    var last = nlen - 1
    var skip = {}
    
    for( scan = 0; scan < last; scan++ )
      skip[ needle[ scan ] ] = last - scan
    
    while( hlen >= nlen ) {
      for( scan = last; stack[ offset + scan ] === needle[ scan ]; scan-- ) {
        if( scan === 0 ) {
          return offset + nlen
        }
      }
      jump = skip[ stack[ offset + last ] ]
      jump = jump != null ? jump : nlen
      hlen -= jump
      offset += jump
    }
    
    return -1
    
  }
  
}

// Exports
module.exports = BoyerMooreHorspool

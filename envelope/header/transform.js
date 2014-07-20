var mime = require( 'mime-lib' )

/**
 * Runs a transform on a header field value
 * @param  {String} key
 * @param  {Mixed}  value
 * @return {Mixed}  
 */
function transform( key, value ) {
  
  for( var i in transform.map ) {
    if( ~transform.map[i].indexOf( key ) )
      return transform.fn[i]( value + '' )
  }
  
  return value
  
}

// Exports
module.exports = transform

/**
 * Maps header field names to
 * their filter functions
 * @type {Object}
 */
transform.map = {
  address:    [ 'from', 'reply-to', 'to', 'cc', 'bcc', 'sender', 'return-path', 'delivered-to' ],
  content:    [ 'content-type', 'content-disposition' ],
  received:   [ 'received', 'x-received' ],
  references: [ 'references' ],
  date:       [ 'date' ],
}

/**
 * Transform functions
 * @type {Object}
 */
transform.fn = {
  
  date: function( input ) {
    return new Date( input )
  },
  
  received: function( input ) {
    
    var parts = input.split( ';' )
    var info = {
      time: new Date( parts.pop().trim() )
    }
    
    input = parts.join( ';' )
    
    ;[ 'from', 'by', 'with', 'id', 'for' ]
      .forEach( function( key, i, a ) {
        
        var remainder = a.slice( i + 1 ).join( '|' )
        var pattern = ( i < a.length - 1 ) ?
          '('+key+')(.+?)(('+remainder+')|$)' :
          '('+key+')(.+?)$'
        
        var match = new RegExp( pattern, 'i' ).exec( input )
        if( match ) {
          info[ key ] = match[2].trim()
        }
        
      })
    
    return info
    
  },
  
  references: function( input ) {
    return input.split( /\s+/g )
  },
  
  /**
   * Desperately tries to get a name
   * from a contact definition.
   * 
   * @param  {String} input
   * @return {Object|Array} 
   */
  address: function( input ) {
    
    // Run over multiple addresses
    if( ~input.indexOf( ',' ) )
      return input.split( ',' )
        .map( this.address )
    
    // Address formats
    var patterns = [
      // "Example Name" <hello@example.com>
      [ /"([^"]+)"\s+<([^>]+)>/, 2, 1 ],
      // 'Example Name' <hello@example.com>
      [ /'([^']+)'\s+<([^>]+)>/, 2, 1 ],
      // Example Name <hello@example.com>
      [ /(.+)\s+<([^>]+)>/, 2, 1 ],
      // <hello@example.com> (Example Name)
      [ /([^\s]+)\s+[(][^)]+[)]/, 1, 2 ],
      // hello@example.com (Example Name)
      [ /<([^>]+)>\s+[(][^)]+[)]/, 1, 2 ],
      // <hello@example.com>
      [ /<([^>]+)>/, 1 ],
      // hello@example.com
      [ /.*/, 0 ]
      // " <- Syntax highlighter fix (Sublime Text 2)
    ]
    
    var pattern, fmt, i, m
    var trim = function( value ) {
      return value != null ?
        ( value || '' ).trim() :
        null
    }
    
    for( fmt in patterns ) {
      i = patterns[ fmt ]
      if( m = i[0].exec( input ) ) {
        input = {
          address: trim( m[ i[1] ] ),
          name: trim( m[ i[2] ] )
        }
        break
      }
    }
    
    return input
    
  },
  
  /**
   * Converts mime strings like
   * `text/plain; charset="utf-8"; format="fixed"`
   * to an object of this form:
   *     
   *     {
   *       mime: 'text/plain',
   *       charset: 'utf-8',
   *       format: 'fixed'
   *     }
   *     
   * @param  {String} input
   * @return {Object} 
   */
  content: function( input ) {
    
    var pattern = /^([^=]*?)([=](['"]?)([^\3]*)\3)?$/
    var object = {}
    
    input = input.split( /;\s*/g )
    object.mime = input.shift()
    
    var i, m, len = input.length
    
    for( i = 0; i < len; i++ ) {
      if( m = pattern.exec( input[i] ) ) {
        if( m[4] ) {
          object[ m[1].toLowerCase() ] =
            mime.decodeWord( m[4] )
        }
      }
    }
    
    return object
    
  }
  
}

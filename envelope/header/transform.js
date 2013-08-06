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
      return transform.fn[i]( value )
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
  address:    [ 'from', 'replyTo', 'to', 'cc', 'bcc', 'sender', 'returnPath', 'deliveredTo' ],
  content:    [ 'contentType', 'contentDisposition' ],
  received:   [ 'received', 'xReceived' ],
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
      time: new Date( parts.pop().trim() ),
      raw: parts.join( ';' )
    }
    
    // Parse out each key/value pair
    // (from, by, with, id, for)
    info.raw.replace(
      /(from|by|with|id|for)\s([^\s]+)((?:\s([(][^\)]+[)]))+)?/ig,
      function( match, key, value ) {
        info[ key ] = value
      }
    )
    
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
      return input.split( ',' ).map( address )
    
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
    
    for( fmt in patterns ) {
      i = patterns[ fmt ]
      if( m = i[0].exec( input ) ) {
        input = {
          address: m[ i[1] ] || null,
          name: m[ i[2] ] || null
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
    
    var pattern = /^(.*?)([=](['"]?)(.*)\3)?$/
    var i, m, object = {}
    
    input = input.split( /;\s*/g )
    object.mime = input.shift()
    
    for( i in input ) {
      if( m = pattern.exec( input[i] ) ) {
        if( m[4] ) {
          m[1] = m[1].toLowerCase().replace(
            /-([^-])/ig, function( m, chr ) {
              return chr.toUpperCase()
            }
          )
          object[ m[1] ] = mime.decodeWord( m[4] )
        }
      }
    }
    
    return object
    
  }
  
}

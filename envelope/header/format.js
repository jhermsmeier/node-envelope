/**
 * Reverses the transform previously
 * applied to the header field
 * @param  {String} key
 * @param  {Mixed}  value
 * @return {String}  
 */
function format( key, value ) {
  
  for( var i in format.map ) {
    if( ~format.map[i].indexOf( key ) )
      return format.fn[i]( value )
  }
  
  return value
  
}

// Exports
module.exports = format

/**
 * Maps header field names to
 * their filter functions
 * @type {Object}
 */
format.map = {
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
format.fn = {
  
  date: function( input ) {
    return new Date( input )
      .toUTCString()
  },
  
  received: function( input ) {
    
    return [].concat( input )
      .map( function( input ) {
        
        var info = [ 'from', 'by', 'with', 'id', 'for' ]
          .reduce( function( str, key ) {
            
            if( input[ key ] ) {
              str = [ str, key, input[ key ] ].join( ' ' )
              str = str.trim()
            }
            
            return str
            
          }, '')
        
        var time = new Date( input.time )
          .toUTCString()
        
        return input.time ?
          info+'; '+time :
          info
        
      }).join( '\n' )
    
  },
  
  references: function( input ) {
    return [].concat( input ).join( ' ' )
  },
  
  address: function( input ) {
    
    return [].concat( input )
      .map( function( input ) {
        if( input.name && input.address ) {
          return input.name + ' <' + input.address + '>'
        } else if( input.name ) {
          return input.name
        } else if( input.address ) {
          return '<' + input.address + '>'
        } else if( typeof input === 'string' ) {
          return input
        } else {
          return ''
        }
      }).join( ', ' )
    
  },
  
  content: function( input ) {
    
    var fields = [ input.mime ]
    
    Object.keys( input ).forEach(
      function( key ) {
        if( key === 'mime' ) return
        fields.push( key+'="'+input[key]+'"' )
      }
    )
    
    return fields.join( '; ' )
    
  }
  
}

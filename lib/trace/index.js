
var utopia = require( '../utopia' )

/**
 * [Trace description]
 * @param {[type]} header [description]
 */
function Trace( header ) {
  
  if( !(this instanceof Trace) )
    return new Trace( header )
  
  if( header != null ) {
    this.parse( header )
  }
  
}

/**
 * Trace header fields (fields that are
 * inserted by the server during relaying)
 * 
 * @type {Array}
 */
Trace.fields = [
  'received',
  'received-spf',
  'authentication-results',
  'return-path',
  'delivered-to'
]

/**
 * [prototype description]
 * @type {Object}
 */
Trace.prototype = {
  
  /**
   * [parse description]
   * @param  {[type]} header [description]
   * @return {[type]}        [description]
   */
  parse: function( header ) {
    
    var i = 0
    var mark = 0
    var c = header.length
    var fields
    
    fields = Trace.fields.join( '|' )
    fields = '^(' + fields + ')[:]\\s'
    fields = new RegExp( fields, 'i' )
    
    for( ; i < c; i++ ) {
      if( fields.test( header[i] ) ) {
        mark = i
      }
    }
    
    if( mark > 0 ) {
      this.run( header.splice( 0, ++mark ) )
    }
    
    return header
    
  },
  
  run: function( headers ) {
    
    var self = this
    var key, fields
    
    fields = Trace.fields.join( '|' )
    fields = '^(' + fields + ')[:]\\s+'
    fields = new RegExp( fields, 'i' )
    
    headers.reverse()
    
    headers.forEach( function ( line, i ) {
      
      key = line.split( ':', 1 )
      key = utopia.toKey( key )
      
      line = line.replace( fields, '' )
      
      if( self[ key ] === undefined ) {
        self[ key ] = [ line ]
      } else {
        self[ key ].push( line )
      }
      
    })
    
  }
  
}

module.exports = Trace

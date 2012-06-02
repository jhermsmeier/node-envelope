
var utopia = require( '../utopia' )

/**
 * [Trace description]
 * @param {[type]} header [description]
 */
function Trace( header ) {
  
  if( !(this instanceof Trace) )
    return new Trace( header )
  
  this.headers = []
  
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
  'Received',
  'Received-SPF',
  'Authentication-Results',
  'Return-Path',
  'Delivered-To'
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
      this.headers = header.splice( 0, ++mark )
    }
    
    return header
    
  },
  
}

module.exports = Trace

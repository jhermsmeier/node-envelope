
var __slice    = Array.prototype.slice
var __toString = Object.prototype.toString

module.exports = {
  
  /*
   * A more exact `typeof`
   * 
   * @param {Object} value
   * @return {String} type
   */
  type: function( value ) {
    value = __toString.call( value );
    return value.substring( 8, value.length - 1 );
  },
  
  toKey: function( input ) {
    
    var self = this
    
    input = input + ''
    input = input.replace( /[^a-z]/gi, '_' )
    input = input.split( '_' )
    
    return input.map( function ( chunk, i ) {
      return ( i !== 0 )
        ? self.ucfirst( chunk )
        : chunk.toLowerCase()
    }).join( '' )
    
  },
  
  ucfirst: function( string ) {
    string = ''+string
    return string.charAt(0).toUpperCase() + string.substring(1)
  },
  
  /**
   * A dead simple way to do inheritance in JS
   * 
   * Stolen from @izs:
   * https://github.com/isaacs/inherits
   * 
   * @param  {Function} c     Child
   * @param  {Function} p     Parent
   * @param  {Object}   proto Prototype
   * @return {Undefined} 
   */
  inherit: function( c, p, proto ) {
    var e = {}
    proto = proto || {}
    ;[ c.prototype, proto ].forEach( function (s) {
      Object.getOwnPropertyNames( s ).forEach(function (k) {
        e[k] = Object.getOwnPropertyDescriptor( s, k )
      })
    })
    c.prototype = Object.create( p.prototype, e )
    c.super = p
  },
  
}


'use strict';

var __slice = Array.prototype.slice;
var __toString = Object.prototype.toString;

/**
 * Utility functions
 * @type {Object}
 */
module.exports = {
  
  /*
   * A more exact `typeof`
   * 
   * @param {Mixed} value
   * @return {String} type
   */
  type: function( value ) {
    value = __toString.call( value );
    return value.substring( 8, value.length - 1 );
  },
  
  /**
   * [toKey description]
   * 
   * @param  {[type]} input [description]
   * @return {[type]}       [description]
   */
  toKey: function( input ) {
    return ( '' + input ).toLowerCase().replace( /[^a-z0-9]/gi, '_' );
  },
  
  /*
   * Object merge (stolen from jQuery)
   * modified to work in this context.
   * 
   * @return {Object}
   */
  extend: function() {
    
    var options, name, src, copy, clone, isObject, isArray,
        target = arguments[0] || {},
        i = 0,
        length = arguments.length,
        deep = false;
    
    // Handle a deep copy
    if( typeof target === 'boolean' ) {
      deep = target;
      target = arguments[1] || {};
      // skip deep and target args
      i = 2;
    }
    
    // Handle case when target is a string
    // or soemthing (possible in deep copy)
    if( typeof target !== 'object' && this.type( target ) !== 'Function' ) {
      target = {};
    }
    
    for( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if( (options = arguments[i]) != null ) {
        // Extend the base object
        for( name in options ) {
          
          src = target[ name ];
          copy = options[ name ];
          
          // Prevent never-ending loop
          if( target === copy )
            continue;
          
          isObject = this.type( copy ) === 'Object';
          isArray  = this.type( copy ) === 'Array';
          
          // Recurse if we're merging plain objects or arrays
          if( deep && copy && isObject || isArray ) {
            
            if( isArray ) {
              isArray = false;
              clone = src && this.type( src ) === 'Array' ? src : [];
            }
            else {
              clone = src && this.type( src ) === 'Object' ? src : {};
            }
            
            // Never move original object, clone them
            target[ name ] = this.extend( deep, clone, copy );
            
          }
          // Don't bring in undefined values
          else if( copy !== undefined ) {
            target[ name ] = copy;
          }
          
        }
      }
    }
    
    // Return the modified object
    return target;
    
  }
  
};

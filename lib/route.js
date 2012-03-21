
module.exports = (function() {
  
  'use strict';
  
  function Route( header ) {
    
    if( !(this instanceof Route) )
      return new Route( header );
    
    this.headers = [];
    
    this.parse( header );
    this.headers.reverse();
    
  }
  
  Route.prototype = {
    
    /**
     * Trace header fields (fields that are
     * inserted by the server during relaying)
     * 
     * @type {Array}
     */
    fields: [
      'received',
      'received-spf',
      'authentication-results',
      'return-path',
      'delivered-to'
    ],
    
    parse: function( header ) {
      
      var i = 0, c = header.length,
          mark = 0, fields;
      
      fields = this.fields.join( '|' );
      fields = '^(' + fields + ')[:]\\s';
      fields = new RegExp( fields, 'i' );
      
      for( ; i < c; i++ ) {
        if( fields.test( header[i] ) )
          mark = i;
      }
      
      if( mark > 0 )
        this.headers = header.splice( 0, ++mark );
      
    }
    
  };
  
  return Route;
  
})();

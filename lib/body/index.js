
// var iconv = require( 'codes' );
var mime  = require( '../mime' );
var xreg  = require( 'xregexp' );

module.exports = (function() {
  
  'use strict';
  
  function Body( header, body ) {
    
    if( !(this instanceof Body) )
      return new Body( header, body );
    
    this.content = body;
    this.parse( header );
    
  }
  
  Body.prototype = {
    
    parse: function( header, body ) {
      
      var charset, boundary;
      
      body = body || this.content;
      
      charset = header.content_type.charset || 'ascii';
      
      // body = iconv.decode( body, charset );
      body = body.toString( charset );
      
      if( /^multipart/i.test( header.content_type.mime ) ) {
        boundary = header.content_type.boundary;
        body = body.split( boundary );
      }
      
      this.content = body;
      
    },
    
  };
  
  return Body;
  
})();

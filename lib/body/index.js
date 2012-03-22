
// var iconv = require( 'codes' );
var mime  = require( '../mime' );
// var xreg  = require( 'xregexp' );

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
      
      var charset, boundary, pattern;
      var self = this;
      
      body = body || this.content;
      
      charset = header.content.type.charset || 'ascii';
      
      // body = iconv.decode( body, charset );
      body = body.toString( charset );
      
      if( /^multipart/i.test( header.content.type.mime ) ) {
        
        boundary = header.content.type.boundary;
        boundary = boundary.replace( /[#?*$\\+{}^|<>.\[\]()]/, function( match ) {
          return '\\' + match;
        });
        
        pattern = '--' + boundary + '\\r\\n';
        pattern+= '((.|[\\r\\n])*?)';
        pattern+= '(?=--' + boundary + ')';
        
        pattern = new RegExp( pattern, 'g' );
        
        this.content = [];
        
        body.replace( pattern, function( match, content ) {
          self.content.push(
            new (require( '../envelope' ))( content )
          );
        });
        
      }
      
    },
    
  };
  
  return Body;
  
})();
